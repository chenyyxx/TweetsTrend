from pyspark import SparkConf, SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row, SQLContext
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from collections import namedtuple
import requests
import tweets


# Creating sentiment analyzer instance
analyzer = SentimentIntensityAnalyzer()

# Get the set of stop_words
stop_words = set(stopwords.words('english'))

# Creating the Spark Context
conf = SparkConf()
conf.setAppName("TwitterAnalysis")
sc = SparkContext(conf=conf)
sc.setLogLevel("ERROR")

# Creating the streaming context
ssc = StreamingContext(sc, 180)
ssc.checkpoint("checkpoint")

# Getting trending topics near locationID
topics = tweets.findTrendingTopics(2442047)

# Getting tweets stream from TCP connection
dataStream = ssc.socketTextStream("localhost", 6666)


# =====================================
def aggregate_words_count(new_values, total_sum):
    return sum(new_values) + (total_sum or 0)


def get_sql_context_instance(spark_context):
    if 'sqlContextSingletonInstance' not in globals():
        globals()['sqlContextSingletonInstance'] = SQLContext(spark_context)
    return globals()['sqlContextSingletonInstance']


def process_word_counts(time, rdd):
    print("\n----------- %s -----------\n" % str(time))
    sql_context = get_sql_context_instance(rdd.context) # Get spark sql singleton context from the current context
    rdd.toDF().registerTempTable("wordCounts")
    # row_rdd = rdd.map(lambda w: Row(word=w[1][0], word_count=w[1][1], topic=w[0][0]))
    # words_df = sql_context.createDataFrame(row_rdd)
    # words_df.registerTempTable("wordCounts")
    top20words = sql_context.sql("select word, word_count, topic from wordCounts order by word_count desc limit 20")
    top20words.show()
    send_word_count_to_server(top20words)


def process_sentiment_scores(time, rdd):
    print("\n----------- %s -----------\n" % str(time))
    sql_context = get_sql_context_instance(rdd.context)
    row_rdd = rdd.map(lambda w: Row(tweet_text=w[0], score=w[1], topic=w[2]))
    sentiment_df = sql_context.createDataFrame(row_rdd)
    sentiment_df.registerTempTable("sentiments")

    category_data = sql_context.sql("select avg(score) as avg_score, count(score) as count_score, min(topic) as min_topic from sentiments")
    category_data.show()
    send_category_to_server(category_data)

    tweets_data = sql_context.sql("select tweet_text, score, topic from sentiments limit 6")
    tweets_data.show()
    send_tweets_to_server(tweets_data)


def send_word_count_to_server(df):
    top_words = [t.word.encode('utf-8') for t in df.select("word").collect()]
    tags_count = [p.word_count for p in df.select("word_count").collect()]
    topic_array = [t.topic.encode('utf-8') for t in df.select("topic").collect()]
    topic = topic_array[0]
    if "#" in topic:
        topicurl = topic.replace("#", "%23")
    else:
        topicurl = topic
    delete_url = 'http://localhost:8080/category/' + topicurl + '/deleteAllWords'
    update_url = 'http://localhost:8080/category/' + topicurl + '/updateAllWords'
    request_data = []
    for i in range(len(top_words)):
        request_data.append({"word": top_words[i], "count": tags_count[i]})
    print(request_data)
    delete_response = requests.delete(delete_url)
    print(delete_response.text)
    response = requests.put(update_url, json=request_data)
    print(response.text)


def send_category_to_server(df):
    topic_array = [t.min_topic.encode('utf-8') for t in df.select("min_topic").collect()]
    topic = topic_array[0]
    if "#" in topic:
        topicurl = topic.replace("#", "%23")
    else:
        topicurl = topic
    avg_array = [t.avg_score for t in df.select("avg_score").collect()]
    avg = avg_array[0]
    count_array = [t.count_score for t in df.select("count_score").collect()]
    count = count_array[0]
    url = 'http://localhost:8080/updateCategory/' + topicurl
    request_data = {"categoryName": topic, "count": count, "score": avg}
    print(request_data)
    response = requests.put(url, json=request_data)
    print(response.text)


def send_tweets_to_server(df):
    sample_tweets = [t.tweet_text.encode('utf-8') for t in df.select("tweet_text").collect()]
    topic_array = [t.topic.encode('utf-8') for t in df.select("topic").collect()]
    topic = topic_array[0]
    if "#" in topic:
        topicurl = topic.replace("#", "%23")
    else:
        topicurl = topic
    delete_url = 'http://localhost:8080/category/'+ topicurl +'/deleteAllTweets'
    update_url = 'http://localhost:8080/category/'+ topicurl +'/updateAllTweets'
    request_data = []
    for t in sample_tweets:
        request_data.append({"content": t})
    print(request_data)
    delete_response = requests.delete(delete_url)
    print(delete_response.text)
    response = requests.put(update_url, json=request_data)
    print(response.text)


wordfields = ("word", "word_count", "topic")
Wordobject = namedtuple('wordObject', wordfields)


def process_words(dataStream, topic):
    words = dataStream.flatMap(lambda line: line.split())\
        .map(lambda word: word.lower())\
        .filter(lambda word: (word not in stop_words))\
        .map(lambda x: (x, 1))\
        .reduceByKey(lambda a, b: a + b)\
        .map(lambda x: Wordobject(x[0], x[1], topic))
    # wordCounts = words.updateStateByKey(aggregate_words_count)
    words.foreachRDD(process_word_counts)


def process_scores(dataStream, topic):
    scores = dataStream.map(lambda text: (text, analyzer.polarity_scores(text.encode("utf-8")).get("compound"), topic))
    scores.foreachRDD(process_sentiment_scores)


def split_dataStream(dataStream, topic):
    topic_stream = dataStream.map(lambda line: line.lower()).filter(lambda line: topic.lower() in line)
    return topic_stream


# =====================================
for t in topics:
    topic_stream = split_dataStream(dataStream, t)
    process_scores(topic_stream, t)
    process_words(topic_stream, t)


ssc.start()
ssc.awaitTermination()

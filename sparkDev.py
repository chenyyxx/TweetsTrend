from pyspark import SparkConf, SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row, SQLContext
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from collections import namedtuple
import requests
import tweetsDev


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
ssc = StreamingContext(sc, 10)
ssc.checkpoint("checkpoint")

topics = sc.broadcast(tweetsDev.findTrendingTopics(2514815))


# Getting tweets stream from TCP connection
dataStream = ssc.socketTextStream("localhost", 5555)
dataStream2 = ssc.socketTextStream("localhost", 5556)

wordfields = ("word", "word_count", "topic")
Wordobject = namedtuple('wordObject', wordfields)
# =====================================
def aggregate_words_count(new_values, total_sum):
    return sum(new_values) + (total_sum or 0)


def get_sql_context_instance(spark_context):
    if 'sqlContextSingletonInstance' not in globals():
        globals()['sqlContextSingletonInstance'] = SQLContext(spark_context)
    return globals()['sqlContextSingletonInstance']


def process_word_counts(time, rdd):
    print("\n----------- %s -----------\n" % str(time))
    # Get spark sql singleton context from the current context
    sql_context = get_sql_context_instance(rdd.context)
    rdd.toDF().registerTempTable("wordCounts")
    # convert the RDD to Row RDD
    # row_rdd = rdd.map(lambda w: Row(word=w[1][0], word_count=w[1][1], topic=w[0][0]))
    # create a DF from the Row RDD
    # words_df = sql_context.createDataFrame(row_rdd)
    # Register the dataframe as table
    # words_df.registerTempTable("wordCounts")
    # get the top 20 words from the table using SQL and print them
    top20words = sql_context.sql("select word, word_count, topic from wordCounts order by word_count desc limit 20")
    top20words.show()


def process_sentiment_scores(time, rdd):
    print("\n----------- %s -----------\n" % str(time))
    sql_context = get_sql_context_instance(rdd.context)
    row_rdd = rdd.map(lambda w: Row(tweet_text=w[0], score=w[1], topic=w[2]))
    sentiment_df = sql_context.createDataFrame(row_rdd)
    sentiment_df.registerTempTable("sentiments")
    sixTweets = sql_context.sql("select tweet_text, score, topic from sentiments limit 6")
    sixTweets.show()
    # send_tweets_to_server(sixTweets)


def send_tweets_to_server(df):
    sample_tweets = [t.tweet_text.encode('utf-8') for t in df.select("tweet_text").collect()]
    topic_array = [t.word.encode('utf-8') for t in df.select("topic").collect()]
    topic = topic_array[0]
    delete_url = 'http://localhost:8080/category/'+ topic +'/deleteAllTweets'
    update_url = 'http://localhost:8080/category/'+ topic +'/updateAllTweets'
    request_data = {'content': sample_tweets.encode('utf-8')}
    delete_response = requests.delete(delete_url)
    response = requests.post(update_url, data=request_data)


def send_word_count_to_server(df):
    top_words = [str(t.word) for t in df.select("word").collect()]
    tags_count = [p.word_count for p in df.select("word_count").collect()]
    topic_array = [str(t.word) for t in df.select("topic").collect()]
    delete_url = 'http://localhost:8080/category'+'Trump'+'deleteAllWords'

# =====================================
# Getting word counts for word cloud
def process_words(dataStream, topic):
    words = dataStream.flatMap(lambda line: line.split())\
        .map(lambda word: word.lower())\
        .filter(lambda word: (word not in stop_words))\
        .map(lambda x: (x, 1))\
        .reduceByKey(lambda a, b: a + b)\
        .map(lambda x: Wordobject(x[0], x[1], topic))
    # wordCounts = words.updateStateByKey(aggregate_words_count)
    words.foreachRDD(process_word_counts)


# Get sentiment scores
def process_scores(dataStream, topic):
    scores = dataStream.map(lambda text: (text, analyzer.polarity_scores(text.encode("utf-8")).get("compound"), topic))
    scores.foreachRDD(process_sentiment_scores)
# scores.foreachRDD(lambda rdd: rdd.toDF().registerTempTable("scores"))


process_words(dataStream, 'Trump')
process_words(dataStream2, 'BlackPink')
#
process_scores(dataStream, 'Trump')
process_scores(dataStream2, 'BlackPink')


ssc.start()
ssc.awaitTermination()

from pyspark import SparkConf, SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import Row, SQLContext
from collections import namedtuple
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.corpus import stopwords

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
ssc = StreamingContext(sc, 2)
ssc.checkpoint("checkpoint")

# Getting tweets stream from TCP connection
dataStream = ssc.socketTextStream("localhost", 5555)


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
    # convert the RDD to Row RDD
    row_rdd = rdd.map(lambda w: Row(word=w[0], word_count=w[1]))
    # create a DF from the Row RDD
    words_df = sql_context.createDataFrame(row_rdd)
    # Register the dataframe as table
    words_df.registerTempTable("wordCounts")
    # get the top 30 words from the table using SQL and print them
    top30words = sql_context.sql("select word, word_count from wordCounts order by word_count desc limit 30")
    top30words.show()


def check_stopwords(word):
    if word in stop_words:
        return False
    else:
        return True


# =====================================
# Getting word counts for word cloud
words = dataStream.flatMap(lambda line: line.split())\
    .map(lambda word: word.lower())\
    .filter(lambda word: check_stopwords(word))\
    .map(lambda x: (x, 1))
wordCounts = words.updateStateByKey(aggregate_words_count)
wordCounts.foreachRDD(process_word_counts)


# Get sentiment scores
# scores = dataStream.map(lambda text: analyzer.polarity_scores(text).get("compound"))
# scores.foreachRDD(lambda rdd: rdd.toDF().registerTempTable("scores"))


ssc.start()

ssc.awaitTermination()

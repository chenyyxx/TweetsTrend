from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.sql import SQLContext
from pyspark.sql.functions import desc
from collections import namedtuple
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from io import StringIO

analyzer = SentimentIntensityAnalyzer()

# Creating the Spark Context
sc = SparkContext(master="local", appName="TwitterStreamApp")
sc.setLogLevel("ERROR")

#creating the streaming context
ssc = StreamingContext(sc, 10)
ssc.checkpoint("checkpoint")

#creating the SQL context
sqlContext = SQLContext(sc)


lines = ssc.socketTextStream("localhost", 5555)

scores = lines.map(lambda text: analyzer.polarity_scores(text))
scores.foreachRDD(lambda rdd: rdd.toDF().registerTempTable("sentiment"))

ssc.start()


ssc.awaitTermination()

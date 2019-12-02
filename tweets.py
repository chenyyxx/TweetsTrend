import tweepy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

consumer_key = 'uUd5T4Dn6ekKOpKGtgW5rFUiB'
consumer_secret = 'f7r33vgQHooHGVJ4d7dHdpLAFR7HAQikW85XPyF7q7xT4MB8LY'
access_token = '1200269515868790784-2Yle4h42nlvYoiAfT4X0pBxHY2V46S'
access_token_secret = 'nocytkpkK4HlGsD4wDweWPiVvBHMzb4755Y0vqxkjj8Ev'


class MyStreamListener(tweepy.StreamListener):

    analyzer = SentimentIntensityAnalyzer()

    def on_status(self, status):
        tweet = status.text
        vs = self.analyzer.polarity_scores(tweet)
        print(tweet)
        print(str(vs))
        print("===========================================")

    def on_error(self, status):
        print(status)

    def on_timeout(self):
        print("Stream connection timed out.")



if __name__ == '__main__':

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    api = tweepy.API(auth)

    myStreamListener = MyStreamListener()
    myStream = tweepy.Stream(auth=api.auth, listener=myStreamListener)

    myStream.filter(track=['Trump'], languages=['en'])
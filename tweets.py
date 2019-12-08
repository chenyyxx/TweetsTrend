import tweepy
import socket

consumer_key = 'uUd5T4Dn6ekKOpKGtgW5rFUiB'
consumer_secret = 'f7r33vgQHooHGVJ4d7dHdpLAFR7HAQikW85XPyF7q7xT4MB8LY'
access_token = '1200269515868790784-2Yle4h42nlvYoiAfT4X0pBxHY2V46S'
access_token_secret = 'nocytkpkK4HlGsD4wDweWPiVvBHMzb4755Y0vqxkjj8Ev'


class MyStreamListener(tweepy.StreamListener):

    def __init__(self, csocket):
        super(MyStreamListener, self).__init__()
        self.client_socket = csocket

    def on_status(self, status):
        try:
            tweet = status.text
            print(tweet)
            self.client_socket.send(tweet.encode('utf-8'))
            return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
        return True

    def on_error(self, status):
        print(status)

    def on_timeout(self):
        print("Stream connection timed out.")


def sendData(c_socket):
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth)
    twitter_stream = tweepy.Stream(auth=api.auth, listener=MyStreamListener(c_socket))
    twitter_stream.filter(track=['Trump'], languages=['en'])


s = socket.socket()
host = 'localhost'
port = 5555
s.bind((host, port))
s.listen(10)
print("Waiting for TCP connection...")
c, addr = s.accept()
print("Connected... Starting getting tweets.")
sendData(c)


import tweepy
import socket
import json
from thread import *

consumer_key = 'uUd5T4Dn6ekKOpKGtgW5rFUiB'
consumer_secret = 'f7r33vgQHooHGVJ4d7dHdpLAFR7HAQikW85XPyF7q7xT4MB8LY'
access_token = '1200269515868790784-2Yle4h42nlvYoiAfT4X0pBxHY2V46S'
access_token_secret = 'nocytkpkK4HlGsD4wDweWPiVvBHMzb4755Y0vqxkjj8Ev'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth)


class MyStreamListener(tweepy.StreamListener):

    def __init__(self, csocket):
        super(MyStreamListener, self).__init__()
        self.client_socket = csocket

    def on_data(self, data):
        try:
            cur_status = json.loads(data)
            tweet = ""
            if 'retweeted_status' in cur_status:
                cur_status = cur_status['retweeted_status']
            elif 'quoted_status' in cur_status:
                tweet = cur_status['text']
                cur_status = cur_status['quoted_status']
            if 'extended_tweet' in cur_status:
                tweet = tweet + cur_status['extended_tweet']['full_text']
            else:
                tweet = tweet + cur_status['text']
            if tweet == '':
                return True
            tweet = " ".join(tweet.split()) + '\n'
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


def findTrendingTopics(location_id):
    # 2514815
    # print(api.trends_closest(38.9072, -77.0369))
    trendsRaw = api.trends_place(location_id)
    trends = [trend['name'] for trend in trendsRaw[0]['trends']]
    top2 = [trends[0], trends[1]]
    return top2


def sendData(c_socket, topic):
    twitter_stream = tweepy.Stream(auth=api.auth, listener=MyStreamListener(c_socket))
    twitter_stream.filter(track=[topic], languages=['en'])


def startTwitterStreamListener(topics):
    t = topics

    host = 'localhost'
    port = 5555

    tot_socket = len(t)
    list_sock = []

    for i in range(tot_socket):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        s.bind((host, port + i))
        s.listen(5)
        list_sock.append(s)
        print "[*] Server listening on %s %d" % (host, (port + i))

    while 1:
        for j in range(len(list_sock)):
            conn, addr = list_sock[j].accept()
            print '[*] Connected with ' + addr[0] + ':' + str(addr[1])
            start_new_thread(sendData, (conn, t[j]))


if __name__ == '__main__':
    # startTwitterStreamListener(findTrendingTopics(2514815))
    startTwitterStreamListener(['Trump', 'BlackPink'])

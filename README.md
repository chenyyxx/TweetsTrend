# TweetsTrend
Created by Yuxiang Chen and Meihua Pan.

#### Step1: How to Deploy the Server Locally
1. Setup mysql and configure database on your local machine
    - If you haven't install MySQL, install it! We recommend the ```MySQL5.7 Community Server```
    - Open your terminal (If the password is not root, please reset it to root)
        ```
        mysql -u <username> -p
        # This will prompt you to enter your password
        # default username and password are both: root
        ```
    - Create database called tweetsTrend
        ```
        create database tweetsTrend;
        use tweetsTrend;
        ```
    - Make sure the port for MySQL is ```3306``` (by default)

2. Open the ```pom.xml```  in the server folder and install all maven dependencies for Spring Boot (If you open it with your IDE, it will automatically import all the dependencies usually).

3. ```cd``` directory ```server/src/main/java/com.ai.tweetsTrend``` and run ```TweetsTrendApplication.java```

4. Once you see ```Started FormationHelperApplication in 4.277 seconds (JVM running for 5.134)``` in the console, the server side is successfully deployed locally.

### Step2: How to Deploy Spark Locally and Stream Tweets from Twitter API
1. Right now, we hard coded our own Twitter developer API (for any other purpose, please replace it with your own token)
2. Pyspark runs on python2.7, it is not compatible with python3 for now.
3. Currently, pyspark only support ```Java-jdk-8```, other version will lead to bugs. Downgrade it if necessary.
3. Install dependencies
    - pyspark : ```pip install pyspark```
    - nltk : ```pip install nltk```
    - vaderSentiment: ```pip install vaderSentiment```
        1. Once you complete install vaderSentiment, please go in to the directory of vaderSentiment.
        2. Open ```vaderSentiment.py```, at the top of the file, add 
            ```
            from io import open
            ```
        
    - tweepy: ```pip install tweepy```
4. open two separate terminals, in both terminals:
    ```cd``` to the project directory (```../TweetsTrend```)
5. Inside the first terminal, run
    ```
    python tweets.py
    ```
6. Inside the second terminal, run
    ```
    python spark.py
    ```
### Step3: How to Open the Web Page Locally
1. Make sure your computer has the latest ```node.js``` installed
2. open a terminal
3. cd into the current project directory ```../TweetsTrend```
    ```
    cd web
    npm install
    npm start
    ```
4. Once it starts running, the website will automatically open in your default browser with address ```localhost:3000/```
# TweetsTrend
Created by Yuxiang Chen and Meihua Pan.

#### API Docs
- ```getCategory(Integer userId, Pageable pageable) -> GET```
        - Description: load all the dances given the userId
        - Url: http://localhost:8080/user/{userId}/getAllDance
        - Example: load all the dances of user with id 12
        http://localhost:8080/user/12/getAllDance
- ```getAllCategory(Integer userId, Pageable pageable) -> GET```
        - Description: load all the dances given the userId
        - Url: http://localhost:8080/user/{userId}/getAllDance
        - Example: load all the dances of user with id 12
        http://localhost:8080/user/12/getAllDance
- ```addCategory(Category) -> POST```
    - Description: add a new dance to the dancer with specified id. Throw exception if user is null.
    - Url: http://localhost:8080/user/{userId}/createDance
    - Request Body:
    ```json
    {
    "numDancers" : "10",
    "dance_name" : "Worth it",
    "music_url" : "http://example_url"
    }
    ```
    - Example: add a dance to the dancer with id 12
    http://localhost:8080/user/12/createDance
- ```updateCategory(Integer userId, Integer danceId, Dance danceRequest) -> PUT```
    - Description: update the specified dance of specified dancer. Throw exception if user or dance is null.
    - Request Body:
    ```json
    {
    "numDancers" : "10",
    "dance_name" : "Worth it",
    "music_url" : "http://example_url"
    }
    ```
    - Url: http://localhost:8080/user/{userId}/saveDance/{danceId}
- ```deleteDance(Integer userId, Integer danceId) -> DELETE```
    - Description: delete the specified dance of the specified user. Throw exception if user or dance is null.
    - Url: http://localhost:8080/user/{userId}/saveDance/{danceId}  
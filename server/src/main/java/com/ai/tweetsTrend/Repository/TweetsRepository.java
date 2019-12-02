package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Tweets;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TweetsRepository extends JpaRepository<Tweets, Integer>{
    
}
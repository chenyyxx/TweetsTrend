package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Category;
import com.ai.tweetsTrend.Model.Tweets;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TweetsRepository extends JpaRepository<Tweets, Integer>{
    public void deleteAllByCategory_CategoryName(String categoryName);
}
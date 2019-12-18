package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Category;
import com.ai.tweetsTrend.Model.Tweets;

import com.ai.tweetsTrend.Model.Words;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TweetsRepository extends JpaRepository<Tweets, Integer>{
    public List<Tweets> findAllByCategory_Id(Integer categoryId);
    public void deleteAllByCategory_CategoryName(String categoryName);
}
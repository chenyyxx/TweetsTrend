package com.ai.tweetsTrend.Controller;

import com.ai.tweetsTrend.Model.Words;
import com.ai.tweetsTrend.Repository.CategoryRepository;
import com.ai.tweetsTrend.Repository.TweetsRepository;

import java.util.List;
import java.util.Optional;

import com.ai.tweetsTrend.Model.Category;
import com.ai.tweetsTrend.Model.Tweets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Controller

public class TweetsController {
    @Autowired
    private TweetsRepository tweetsRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping(path="/category/{categoryId}/getAllTweets")
    public @ResponseBody List<Tweets> getTweets(@PathVariable(value = "categoryId") Integer categoryId){
        return tweetsRepository.findAllByCategory_Id(categoryId);
    }

    @PutMapping("category/{categoryName}/updateAllTweets")
    public @ResponseBody String updateAllTweetsByCategory(@PathVariable(value = "categoryName") String categoryName, @RequestBody List<Tweets> tweets){
        Category category = categoryRepository.findByCategoryName(categoryName);
        if(category!=null){
            for (Tweets tweet: tweets){
                tweet.setCategory(category);
                tweetsRepository.save(tweet);
            }
            return "Successfully saved!";
        } else{
            return "Category not found";
        }
    }
    @Transactional
    @DeleteMapping("category/{categoryName}/deleteAllTweets")
    public @ResponseBody String deleteAllTweetsByCategoryName(@PathVariable(value="categoryName") String categoryName){
        tweetsRepository.deleteAllByCategory_CategoryName(categoryName);
        return "Successfully deleted all tweets in " + categoryName;
    }


}
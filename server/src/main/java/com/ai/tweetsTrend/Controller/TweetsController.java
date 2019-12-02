package com.ai.tweetsTrend.Controller;

import com.ai.tweetsTrend.Repository.CategoryRepository;
import com.ai.tweetsTrend.Repository.TweetsRepository;
import com.ai.tweetsTrend.Model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller

public class TweetsController{
    @Autowired
    private TweetsRepository tweetsRepository;
    
}
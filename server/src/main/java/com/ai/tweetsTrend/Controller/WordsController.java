package com.ai.tweetsTrend.Controller;

import com.ai.tweetsTrend.Repository.CategoryRepository;
import com.ai.tweetsTrend.Repository.TweetsRepository;
import com.ai.tweetsTrend.Repository.WordsRepository;

import java.util.Optional;

import com.ai.tweetsTrend.Exception.ResourceNotFoundException;
import com.ai.tweetsTrend.Model.Category;
import com.ai.tweetsTrend.Model.Tweets;
import com.ai.tweetsTrend.Model.Words;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller

public class WordsController {
    @Autowired
    private WordsRepository wordsRepository;
    @Autowired
    private CategoryRepository CategoryRepository;

    @GetMapping(path="/category/{categoryId}/getAllwords")
    public @ResponseBody Page<Words> getWords(@PathVariable(value = "categoryId") Integer categoryId, Pageable pageable){
        return wordsRepository.findByCategoryId(categoryId, pageable);
    }

    @PostMapping("/category/{categoryId}/addWord")
    public @ResponseBody Words addWord(@PathVariable(value = "categoryId") Integer categoryId, @RequestBody Words words){
        return CategoryRepository.findById(categoryId).map(category ->{
            words.setWord(words.getWord());
            words.setCount(words.getCount());
            words.setCategory(category);
            return wordsRepository.save(words);
        }).orElseThrow(()-> new ResourceNotFoundException("Category Id "+ categoryId + " Not Found"));
    }
}
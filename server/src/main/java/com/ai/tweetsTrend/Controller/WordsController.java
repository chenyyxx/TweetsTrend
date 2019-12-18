package com.ai.tweetsTrend.Controller;

import com.ai.tweetsTrend.Repository.CategoryRepository;
import com.ai.tweetsTrend.Repository.TweetsRepository;
import com.ai.tweetsTrend.Repository.WordsRepository;

import java.util.List;
import java.util.Optional;

import com.ai.tweetsTrend.Exception.ResourceNotFoundException;
import com.ai.tweetsTrend.Model.Category;
import com.ai.tweetsTrend.Model.Tweets;
import com.ai.tweetsTrend.Model.Words;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Controller

public class WordsController {
    @Autowired
    private WordsRepository wordsRepository;
    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping(path="/category/{categoryId}/getAllWords")
    public @ResponseBody List<Words> getWords(@PathVariable(value = "categoryId") Integer categoryId){
        return wordsRepository.findAllByCategory_Id(categoryId);
    }
//
//    @PostMapping("/category/{categoryId}/addWord")
//    public @ResponseBody Words addWord(@PathVariable(value = "categoryId") Integer categoryId, @RequestBody Words words){
//        return categoryRepository.findById(categoryId).map(category ->{
//            words.setWord(words.getWord());
//            words.setCount(words.getCount());
//            words.setCategory(category);
//            return wordsRepository.save(words);
//        }).orElseThrow(()-> new ResourceNotFoundException("Category Id "+ categoryId + " Not Found"));
//    }

    @PutMapping("category/{categoryName}/updateAllWords")
    public @ResponseBody String updateAllWordsByCategory(@PathVariable(value = "categoryName") String categoryName, @RequestBody List<Words> words){
        Category category = categoryRepository.findByCategoryName(categoryName);
        if(category!=null){
            for (Words word: words){
                word.setCategory(category);
                wordsRepository.save(word);
            }
            return "Successfully saved!";
        } else{
            return "Category not found";
        }
    }
    @Transactional
    @DeleteMapping("category/{categoryName}/deleteAllWords")
    public @ResponseBody String deleteAllWordsByCategoryName(@PathVariable(value="categoryName") String categoryName){
        wordsRepository.deleteAllByCategory_CategoryName(categoryName);
        return "Successfully deleted all words in " + categoryName;
    }
}
package com.ai.tweetsTrend.Controller;

import com.ai.tweetsTrend.Exception.ResourceNotFoundException;
import com.ai.tweetsTrend.Repository.CategoryRepository;
import com.ai.tweetsTrend.Model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class CategoryController{
    @Autowired
    private CategoryRepository categoryRepository;

//    @PostMapping(path="/addCategory")
//    public @ResponseBody String addCategory (@RequestBody Category category){
//        categoryRepository.save(category);
//        return "Saved";
//    }

    @PutMapping("/updateCategory/{categoryName}")
    public @ResponseBody Category updateCategory(@PathVariable(value = "categoryName") String categoryName, @RequestBody Category category){
        Category queryResult =  categoryRepository.findByCategoryName(categoryName);
        if(queryResult!=null){
            queryResult.setCategoryName(categoryName);
            queryResult.setCount(category.getCount());
            queryResult.setScore(category.getScore());
            categoryRepository.save(queryResult);
            return queryResult;
        } else{
            categoryRepository.save(category);
            return category;
        }


    }

    @GetMapping(path="/category/get/{value}")
    public @ResponseBody List<Category> getRelatedCategory(@PathVariable(name="value") String value){
        return categoryRepository.findAllByCategoryNameContaining(value);
    }

    @GetMapping(path="category/getAll")
    public @ResponseBody
    Page<Category> getAll(Pageable pageable){
        return categoryRepository.findAll(pageable);
    }

    @GetMapping(path="/getCategory/{categoryName}")
    public @ResponseBody Category getCategory(@PathVariable(name = "categoryName")String categoryName){

        Category category =  categoryRepository.findByCategoryName(categoryName);
        if(category!=null){
            return category;
        } else{
            throw new ResourceNotFoundException("categoryName "+categoryName+"Not Found, use the POST API to add one");
        }
    }
}
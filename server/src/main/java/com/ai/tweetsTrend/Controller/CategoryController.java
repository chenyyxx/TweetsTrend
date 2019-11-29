package com.ai.tweetsTrend.Controller;

import com.ai.tweetsTrend.Repository.CategoryRepository;
import com.ai.tweetsTrend.Model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class CategoryController{
    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping(path="/setCategory")
    public @ResponseBody String addCategory (@RequestParam(name = "name") String categoryName, @RequestParam(name="score") Integer score){
        Category category = new Category();
        category.setCategoryName(categoryName);
        category.setScore(score);
        categoryRepository.save(category);
        return "Saved";
    }

    @GetMapping(path="/getAll")
    public @ResponseBody Iterable<Category> getAll(){
        return categoryRepository.findAll();
    }

    @GetMapping(path="/getCategory")
    public @ResponseBody Category getCategory(@RequestParam(name = "name")String categoryName){
        return categoryRepository.findByCategoryName(categoryName);
    }
}
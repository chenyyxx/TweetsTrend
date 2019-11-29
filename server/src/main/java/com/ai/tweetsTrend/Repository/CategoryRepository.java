package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer>{
    public Category findByCategoryName(String name);
}
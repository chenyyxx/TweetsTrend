package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer>{
    public Category findByCategoryName(String name);
    public List<Category> findAllByCategoryNameContaining(String value);
    Page<Category> findAll(Pageable pageable);
//    public List<Category> findAllByCategoryName(String name);
}
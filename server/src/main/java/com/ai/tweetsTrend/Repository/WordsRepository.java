package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Words;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WordsRepository extends JpaRepository<Words, Integer>{
    public List<Words> findAllByCategory_Id(Integer categoryId);
    public void deleteAllByCategory_CategoryName(String name);
}
package com.ai.tweetsTrend.Repository;

import com.ai.tweetsTrend.Model.Words;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordsRepository extends JpaRepository<Words, Integer>{
    public Page<Words> findByCategoryId(Integer categoryId, Pageable pageable);
}
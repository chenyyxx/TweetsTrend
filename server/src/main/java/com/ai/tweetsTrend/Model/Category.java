package com.ai.tweetsTrend.Model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Category{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String categoryName;

    private Double score;

    private Integer count;

    public Integer getId(){
        return id;
    }

    public void setId(Integer id){
        this.id = id;
    }

    public String getCategoryName(){
        return categoryName;
    }

    public void setCategoryName(String categoryName){
        this.categoryName = categoryName;
    }

    public Double getScore(){
        return score;
    }

    public void setScore(Double score){
        this.score = score;
    }

    public Integer getCount(){
        return count;
    }

    public void setCount(Integer count){
        this.count = count;
    }
}
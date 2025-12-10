package com.studentgrade.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableLogic;
import java.time.LocalDateTime;

/**
 * 成绩实体类
 */
@TableName("grade")
public class Grade {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long studentId;
    private Long classId;
    private Double regularScore;
    private Double midtermScore;
    private Double labScore;
    private Double finalExamScore;
    private Double comprehensiveScore;
    private String level;
    private LocalDateTime createdTime;
    @TableLogic
    private Integer deleted;

    public Grade() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }

    public Double getRegularScore() {
        return regularScore;
    }

    public void setRegularScore(Double regularScore) {
        this.regularScore = regularScore;
    }

    public Double getMidtermScore() {
        return midtermScore;
    }

    public void setMidtermScore(Double midtermScore) {
        this.midtermScore = midtermScore;
    }

    public Double getLabScore() {
        return labScore;
    }

    public void setLabScore(Double labScore) {
        this.labScore = labScore;
    }

    public Double getFinalExamScore() {
        return finalExamScore;
    }

    public void setFinalExamScore(Double finalExamScore) {
        this.finalExamScore = finalExamScore;
    }

    public Double getComprehensiveScore() {
        return comprehensiveScore;
    }

    public void setComprehensiveScore(Double comprehensiveScore) {
        this.comprehensiveScore = comprehensiveScore;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public Integer getDeleted() {
        return deleted;
    }

    public void setDeleted(Integer deleted) {
        this.deleted = deleted;
    }
}

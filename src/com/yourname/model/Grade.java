package com.yourname.model;

import java.time.LocalDateTime;

/**
 * 成绩实体类
 * 用于表示学生成绩信息
 */
public class Grade {
    /** 关联学生的学号 */
    private String studentId;
    /** 关联课程的名称 */
    private String courseName;
    /** 平时成绩 */
    private int regularScore;
    /** 期中考试成绩 */
    private int midtermScore;
    /** 实验成绩 */
    private int labScore;
    /** 期末考试成绩 */
    private int finalExamScore;
    /** 根据以上四项计算得出的综合成绩 */
    private double comprehensiveScore;
    /** 记录成绩生成的时间 */
    private LocalDateTime timestamp;

    /**
     * 构造函数，初始化所有属性
     * @param studentId 学生学号
     * @param courseName 课程名称
     * @param regularScore 平时成绩
     * @param midtermScore 期中考试成绩
     * @param labScore 实验成绩
     * @param finalExamScore 期末考试成绩
     */
    public Grade(String studentId, String courseName, int regularScore, int midtermScore, 
                 int labScore, int finalExamScore) {
        this.studentId = studentId;
        this.courseName = courseName;
        this.regularScore = regularScore;
        this.midtermScore = midtermScore;
        this.labScore = labScore;
        this.finalExamScore = finalExamScore;
        // 计算综合成绩：平时20% + 期中20% + 实验30% + 期末30%
        this.comprehensiveScore = regularScore * 0.2 + midtermScore * 0.2 + 
                                  labScore * 0.3 + finalExamScore * 0.3;
        this.timestamp = LocalDateTime.now();
    }

    /**
     * 获取学生学号
     * @return 学生学号
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * 设置学生学号
     * @param studentId 学生学号
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    /**
     * 获取课程名称
     * @return 课程名称
     */
    public String getCourseName() {
        return courseName;
    }

    /**
     * 设置课程名称
     * @param courseName 课程名称
     */
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    /**
     * 获取平时成绩
     * @return 平时成绩
     */
    public int getRegularScore() {
        return regularScore;
    }

    /**
     * 设置平时成绩
     * @param regularScore 平时成绩
     */
    public void setRegularScore(int regularScore) {
        this.regularScore = regularScore;
        updateComprehensiveScore();
    }

    /**
     * 获取期中考试成绩
     * @return 期中考试成绩
     */
    public int getMidtermScore() {
        return midtermScore;
    }

    /**
     * 设置期中考试成绩
     * @param midtermScore 期中考试成绩
     */
    public void setMidtermScore(int midtermScore) {
        this.midtermScore = midtermScore;
        updateComprehensiveScore();
    }

    /**
     * 获取实验成绩
     * @return 实验成绩
     */
    public int getLabScore() {
        return labScore;
    }

    /**
     * 设置实验成绩
     * @param labScore 实验成绩
     */
    public void setLabScore(int labScore) {
        this.labScore = labScore;
        updateComprehensiveScore();
    }

    /**
     * 获取期末考试成绩
     * @return 期末考试成绩
     */
    public int getFinalExamScore() {
        return finalExamScore;
    }

    /**
     * 设置期末考试成绩
     * @param finalExamScore 期末考试成绩
     */
    public void setFinalExamScore(int finalExamScore) {
        this.finalExamScore = finalExamScore;
        updateComprehensiveScore();
    }

    /**
     * 获取综合成绩
     * @return 综合成绩
     */
    public double getComprehensiveScore() {
        return comprehensiveScore;
    }

    /**
     * 获取成绩生成时间
     * @return 成绩生成时间
     */
    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    /**
     * 设置成绩生成时间
     * @param timestamp 成绩生成时间
     */
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * 更新综合成绩
     */
    private void updateComprehensiveScore() {
        this.comprehensiveScore = regularScore * 0.2 + midtermScore * 0.2 + 
                                  labScore * 0.3 + finalExamScore * 0.3;
    }

    /**
     * 重写toString方法，便于调试
     * @return 成绩信息字符串
     */
    @Override
    public String toString() {
        return "Grade{" +
                "studentId='" + studentId + '\'' +
                ", courseName='" + courseName + '\'' +
                ", regularScore=" + regularScore +
                ", midtermScore=" + midtermScore +
                ", labScore=" + labScore +
                ", finalExamScore=" + finalExamScore +
                ", comprehensiveScore=" + String.format("%.2f", comprehensiveScore) +
                ", timestamp=" + timestamp +
                '}';
    }
}

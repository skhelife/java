package com.yourname.model;

/**
 * 课程实体类
 * 用于表示课程信息
 */
public class Course {
    /** 课程编号 */
    private String courseId;
    /** 课程名字 */
    private String courseName;

    /**
     * 构造函数，初始化所有属性
     * @param courseId 课程编号
     * @param courseName 课程名字
     */
    public Course(String courseId, String courseName) {
        this.courseId = courseId;
        this.courseName = courseName;
    }

    /**
     * 获取课程编号
     * @return 课程编号
     */
    public String getCourseId() {
        return courseId;
    }

    /**
     * 设置课程编号
     * @param courseId 课程编号
     */
    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    /**
     * 获取课程名字
     * @return 课程名字
     */
    public String getCourseName() {
        return courseName;
    }

    /**
     * 设置课程名字
     * @param courseName 课程名字
     */
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    /**
     * 重写toString方法，便于调试
     * @return 课程信息字符串
     */
    @Override
    public String toString() {
        return "Course{" +
                "courseId='" + courseId + '\'' +
                ", courseName='" + courseName + '\'' +
                '}';
    }
}

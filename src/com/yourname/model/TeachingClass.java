package com.yourname.model;

import java.util.ArrayList;
import java.util.List;

/**
 * 教学班实体类
 * 用于表示教学班信息
 */
public class TeachingClass {
    /** 教学班号 */
    private String classId;
    /** 开课学期 */
    private String semester;
    /** 该教学班的任课教师对象 */
    private Teacher teacher;
    /** 该教学班的课程对象 */
    private Course course;
    /** 该教学班的学生列表 */
    private List<Student> students = new ArrayList<>();

    /**
     * 构造函数，初始化所有属性
     * @param classId 教学班号
     * @param semester 开课学期
     * @param teacher 任课教师对象
     * @param course 课程对象
     */
    public TeachingClass(String classId, String semester, Teacher teacher, Course course) {
        this.classId = classId;
        this.semester = semester;
        this.teacher = teacher;
        this.course = course;
    }

    /**
     * 获取教学班号
     * @return 教学班号
     */
    public String getClassId() {
        return classId;
    }

    /**
     * 设置教学班号
     * @param classId 教学班号
     */
    public void setClassId(String classId) {
        this.classId = classId;
    }

    /**
     * 获取开课学期
     * @return 开课学期
     */
    public String getSemester() {
        return semester;
    }

    /**
     * 设置开课学期
     * @param semester 开课学期
     */
    public void setSemester(String semester) {
        this.semester = semester;
    }

    /**
     * 获取任课教师对象
     * @return 任课教师对象
     */
    public Teacher getTeacher() {
        return teacher;
    }

    /**
     * 设置任课教师对象
     * @param teacher 任课教师对象
     */
    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

    /**
     * 获取课程对象
     * @return 课程对象
     */
    public Course getCourse() {
        return course;
    }

    /**
     * 设置课程对象
     * @param course 课程对象
     */
    public void setCourse(Course course) {
        this.course = course;
    }

    /**
     * 获取学生列表
     * @return 学生列表
     */
    public List<Student> getStudents() {
        return students;
    }

    /**
     * 设置学生列表
     * @param students 学生列表
     */
    public void setStudents(List<Student> students) {
        this.students = students;
    }

    /**
     * 添加学生到教学班
     * @param student 学生对象
     */
    public void addStudent(Student student) {
        this.students.add(student);
    }

    /**
     * 重写toString方法，便于调试
     * @return 教学班信息字符串
     */
    @Override
    public String toString() {
        return "TeachingClass{" +
                "classId='" + classId + '\'' +
                ", semester='" + semester + '\'' +
                ", teacher=" + teacher +
                ", course=" + course +
                ", students=" + students.size() + " students" +
                '}';
    }
}

package com.yourname.model;

/**
 * 学生实体类
 * 用于表示学生信息
 */
public class Student {
    /** 学号 */
    private String studentId;
    /** 姓名 */
    private String name;
    /** 性别 */
    private String gender;

    /**
     * 构造函数，初始化所有属性
     * @param studentId 学号
     * @param name 姓名
     * @param gender 性别
     */
    public Student(String studentId, String name, String gender) {
        this.studentId = studentId;
        this.name = name;
        this.gender = gender;
    }

    /**
     * 获取学号
     * @return 学号
     */
    public String getStudentId() {
        return studentId;
    }

    /**
     * 设置学号
     * @param studentId 学号
     */
    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    /**
     * 获取姓名
     * @return 姓名
     */
    public String getName() {
        return name;
    }

    /**
     * 设置姓名
     * @param name 姓名
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取性别
     * @return 性别
     */
    public String getGender() {
        return gender;
    }

    /**
     * 设置性别
     * @param gender 性别
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * 重写toString方法，便于调试
     * @return 学生信息字符串
     */
    @Override
    public String toString() {
        return "Student{" +
                "studentId='" + studentId + '\'' +
                ", name='" + name + '\'' +
                ", gender='" + gender + '\'' +
                '}';
    }
}

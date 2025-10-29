package com.yourname.model;

/**
 * 教师实体类
 * 用于表示教师信息
 */
public class Teacher {
    /** 教师编号 */
    private String teacherId;
    /** 姓名 */
    private String name;

    /**
     * 构造函数，初始化所有属性
     * @param teacherId 教师编号
     * @param name 姓名
     */
    public Teacher(String teacherId, String name) {
        this.teacherId = teacherId;
        this.name = name;
    }

    /**
     * 获取教师编号
     * @return 教师编号
     */
    public String getTeacherId() {
        return teacherId;
    }

    /**
     * 设置教师编号
     * @param teacherId 教师编号
     */
    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
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
     * 重写toString方法，便于调试
     * @return 教师信息字符串
     */
    @Override
    public String toString() {
        return "Teacher{" +
                "teacherId='" + teacherId + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}

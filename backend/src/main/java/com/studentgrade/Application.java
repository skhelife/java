package com.studentgrade;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 学生成绩管理系统 - Spring Boot 启动类
 * 实验四：后端 Spring Boot 设计实现
 */
@SpringBootApplication
@MapperScan("com.studentgrade.mapper")
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("========================================");
        System.out.println("  学生成绩管理系统后端启动成功！");
        System.out.println("  访问地址: http://localhost:4000");
        System.out.println("========================================");
    }
}

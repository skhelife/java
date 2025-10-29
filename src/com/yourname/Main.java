package com.yourname;

import com.yourname.ui.CommandLineUI;

/**
 * 主程序入口
 * 学生成绩管理系统
 */
public class Main {
    /**
     * 程序主入口方法
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        // 创建命令行界面实例
        CommandLineUI ui = new CommandLineUI();
        
        try {
            // 启动应用程序
            ui.start();
        } catch (Exception e) {
            System.err.println("程序运行出现异常：" + e.getMessage());
            e.printStackTrace();
        } finally {
            // 确保资源被正确释放
            ui.close();
        }
    }
}

package com.yourname.ui;

import com.yourname.service.EducationService;
import com.yourname.model.TeachingClass;
import static com.yourname.ui.UIUtils.*;

import java.util.Scanner;
import java.util.List;

/**
 * 命令行用户界面类
 * 负责处理所有的控制台输入和输出
 */
public class CommandLineUI {
    /** 教育服务实例 */
    private EducationService educationService;
    /** 扫描器用于读取用户输入 */
    private Scanner scanner;

    /**
     * 构造函数
     * 初始化教育服务和扫描器
     */
    public CommandLineUI() {
        this.educationService = EducationService.getInstance();
        this.scanner = new Scanner(System.in);
    }

    /**
     * 启动应用程序
     */
    public void start() {
        // 显示系统横幅
        printSystemBanner();
        
        // 显示初始化动画
        printLoadingAnimation("正在初始化系统数据...");
        educationService.initializeData();
        printSuccess("系统初始化完成！");
        
        // 主循环
        while (true) {
            clearScreen();
            printSystemBanner();
            printMainMenu();
            
            String choice = scanner.nextLine().trim();
            
            try {
                switch (choice) {
                    case "1":
                        handleDisplayClassGrades();
                        break;
                    case "2":
                        handleScoreDistribution();
                        break;
                    case "3":
                        handleFindStudentGrades();
                        break;
                    case "4":
                        handleStudentRankings();
                        break;
                    case "5":
                        handleShowAllClasses();
                        break;
                    case "6":
                        handleSystemStatistics();
                        break;
                    case "7":
                        clearScreen();
                        System.out.println();
                        
                        // 超炫酷的退出动画
                        printColoredLine("================================================================================", BG_RED + BOLD_WHITE);
                        printColoredLine("=                                                                              =", BG_RED + BOLD_WHITE);
                        printColoredLine("=     感谢您使用学生教务管理系统！                                                     =", BG_RED + BOLD_YELLOW);
                        printColoredLine("=     THANK YOU FOR USING STUDENT MANAGEMENT SYSTEM!                         =", BG_RED + BOLD_YELLOW);
                        printColoredLine("=     祝您学习工作愉快！                                                          =", BG_RED + BOLD_YELLOW);
                        printColoredLine("=     Have a great day!                                                       =", BG_RED + BOLD_YELLOW);
                        printColoredLine("=     再见！                                                                    =", BG_RED + BOLD_YELLOW);
                        printColoredLine("=                                                                              =", BG_RED + BOLD_WHITE);
                        printColoredLine("================================================================================", BG_RED + BOLD_WHITE);
                        
                        System.out.println();
                        printGradientSeparator(80);
                        printColoredLine("                    【庆祝】 感谢使用学生成绩管理系统至尊版！ 【庆祝】", BOLD_GREEN);
                        printColoredLine("                       【挥手】 祝您工作顺利，学业进步！ 【挥手】", BOLD_CYAN);
                        printColoredLine("                            ★★★ 再见，期待下次相遇！ ★★★", BOLD_YELLOW);
                        printGradientSeparator(80);
                        System.out.println();
                        
                        // 倒计时特效
                        for (int i = 3; i >= 1; i--) {
                            printColored("                               >>> 系统将在 " + i + " 秒后退出 <<<", BOLD_RED);
                            try {
                                Thread.sleep(1000);
                                System.out.print("\r");
                            } catch (InterruptedException e) {
                                Thread.currentThread().interrupt();
                            }
                        }
                        System.out.println();
                        printColoredLine("                                  >>> 系统已安全退出 <<<", BOLD_GREEN);
                        return;
                    default:
                        printError("无效的选择，请重新输入！");
                        Thread.sleep(1500);
                }
            } catch (Exception e) {
                printError("操作出现错误：" + e.getMessage());
                e.printStackTrace();
            }
            
            if (!choice.equals("7")) {
                System.out.println();
                printGradientSeparator(60);
                printColored("【暂停】  按回车键返回主菜单...", BOLD_CYAN);
                scanner.nextLine(); // 使用scanner而不是System.in.read()
            }
        }
    }



    /**
     * 处理显示教学班成绩
     */
    private void handleDisplayClassGrades() {
        clearScreen();
        printFancyTitle("【图表】 教学班成绩查询系统");
        System.out.println();
        
        // 显示所有教学班
        printInfo("可选择的教学班列表：");
        List<TeachingClass> classes = educationService.getAllTeachingClasses();
        
        String[] headers = {"序号", "教学班号", "课程名称", "任课教师", "学生数"};
        int[] widths = {8, 15, 20, 15, 10};
        
        printTableHeader(headers, widths);
        
        for (int i = 0; i < classes.size(); i++) {
            TeachingClass tc = classes.get(i);
            String[] rowData = {
                String.valueOf(i + 1),
                tc.getClassId(),
                tc.getCourse().getCourseName(),
                tc.getTeacher().getName(),
                tc.getStudents().size() + "人"
            };
            printTableRow(rowData, widths, i % 2 == 0);
        }
        
        printTableFooter(widths);
        
        System.out.println();
        printColored("【搜索】 请输入教学班号: ", BOLD_YELLOW);
        String classId = scanner.nextLine().trim();
        
        if (classId.isEmpty()) {
            printError("教学班号不能为空！");
            return;
        }
        
        printColored("【上升】 是否按成绩排序？(y/n): ", BOLD_YELLOW);
        String sortChoice = scanner.nextLine().trim().toLowerCase();
        boolean sortByScore = sortChoice.equals("y") || sortChoice.equals("yes");
        
        System.out.println();
        printLoadingAnimation("正在查询教学班成绩...");
        educationService.displayClassGradesWithSorting(classId, sortByScore);
    }

    /**
     * 处理成绩分布统计
     */
    private void handleScoreDistribution() {
        clearScreen();
        printFancyTitle("【上升】 成绩分布统计分析");
        System.out.println();
        
        printLoadingAnimation("正在统计成绩分布...");
        educationService.displayScoreDistribution();
    }

    /**
     * 处理查找学生成绩
     */
    private void handleFindStudentGrades() {
        clearScreen();
        printFancyTitle("【搜索】 学生成绩查询系统");
        System.out.println();
        
        printInfo("支持按学号或姓名查询学生成绩");
        printColored("【目标】 请输入学号或姓名: ", BOLD_YELLOW);
        String studentIdOrName = scanner.nextLine().trim();
        
        if (studentIdOrName.isEmpty()) {
            printError("学号或姓名不能为空！");
            return;
        }
        
        System.out.println();
        printLoadingAnimation("正在查询学生成绩...");
        educationService.findStudentGrades(studentIdOrName);
    }

    /**
     * 处理学生排名显示
     */
    private void handleStudentRankings() {
        clearScreen();
        printFancyTitle("【奖杯】 学生总成绩排行榜");
        System.out.println();
        
        printLoadingAnimation("正在计算学生排名...");
        educationService.displayAllStudentRankings();
    }

    /**
     * 处理显示所有教学班信息
     */
    private void handleShowAllClasses() {
        clearScreen();
        printFancyTitle("【清单】 教学班信息总览");
        System.out.println();
        
        printLoadingAnimation("正在加载教学班信息...");
        
        List<TeachingClass> classes = educationService.getAllTeachingClasses();
        
        String[] headers = {"教学班号", "课程名称", "任课教师", "学期", "学生数"};
        int[] widths = {15, 20, 15, 12, 10};
        
        printTableHeader(headers, widths);
        
        for (int i = 0; i < classes.size(); i++) {
            TeachingClass tc = classes.get(i);
            String[] rowData = {
                tc.getClassId(),
                tc.getCourse().getCourseName(),
                tc.getTeacher().getName(),
                tc.getSemester(),
                tc.getStudents().size() + "人"
            };
            printTableRow(rowData, widths, i % 2 == 0);
        }
        
        printTableFooter(widths);
        
        System.out.println();
        printSuccess("共有 " + classes.size() + " 个教学班");
    }
    
    /**
     * 处理系统统计信息
     */
    private void handleSystemStatistics() {
        clearScreen();
        printFancyTitle("【目标】 系统统计信息");
        System.out.println();
        
        printLoadingAnimation("正在收集系统统计数据...");
        educationService.displaySystemStatistics();
    }

    /**
     * 关闭资源
     */
    public void close() {
        if (scanner != null) {
            scanner.close();
        }
    }
}

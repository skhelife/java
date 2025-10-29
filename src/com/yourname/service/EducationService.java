package com.yourname.service;

import com.yourname.model.*;
import static com.yourname.ui.UIUtils.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 教育服务类
 * 使用单例模式实现，负责所有的数据管理和业务逻辑
 */
public class EducationService {
    /** 单例实例 */
    private static EducationService instance;
    /** 存储所有学生 */
    private List<Student> allStudents = new ArrayList<>();
    /** 存储所有教师 */
    private List<Teacher> allTeachers = new ArrayList<>();
    /** 存储所有课程 */
    private List<Course> allCourses = new ArrayList<>();
    /** 存储所有教学班 */
    private List<TeachingClass> allTeachingClasses = new ArrayList<>();
    /** 存储所有成绩 */
    private List<Grade> allGrades = new ArrayList<>();
    /** 学生映射表，提高查询效率 */
    private Map<String, Student> studentMap = new HashMap<>();
    /** 教学班映射表，提高查询效率 */
    private Map<String, TeachingClass> teachingClassMap = new HashMap<>();
    /** 随机数生成器 */
    private Random random = new Random();

    /**
     * 私有构造函数，防止外部实例化
     */
    private EducationService() {}

    /**
     * 获取单例实例
     * @return EducationService实例
     */
    public static EducationService getInstance() {
        if (instance == null) {
            instance = new EducationService();
        }
        return instance;
    }

    /**
     * 初始化数据
     * 创建学生、教师、课程、教学班和成绩数据
     */
    public void initializeData() {
        // 创建学生
        createStudents();
        
        // 创建教师
        createTeachers();
        
        // 创建课程
        createCourses();
        
        // 创建教学班
        createTeachingClasses();
        
        // 分配学生到教学班
        assignStudentsToClasses();
        
        // 生成成绩
        generateGrades();
        
        printSuccess("数据初始化完成！");
        printInfo("共创建：" + allStudents.size() + "个学生，" + 
                  allTeachers.size() + "个教师，" + 
                  allCourses.size() + "门课程，" + 
                  allTeachingClasses.size() + "个教学班，" +
                  allGrades.size() + "条成绩记录");
    }

    /**
     * 创建学生数据
     */
    private void createStudents() {
        String[] firstNames = {"张", "李", "王", "刘", "陈", "杨", "赵", "黄", "周", "吴", 
                              "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗",
                              "钱", "孔", "曹", "严", "华", "金", "魏", "陶", "姜", "戚"};
        String[] secondNames = {"伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军", 
                               "洋", "勇", "艳", "杰", "娟", "涛", "明", "超", "秀兰", "霞",
                               "辉", "鹏", "飞", "宇", "欣", "悦", "婷", "浩", "凯", "宁"};
        String[] genders = {"男", "女"};
        
        // 创建真实的学生数据，确保姓名不重复
        Set<String> usedNames = new HashSet<>();
        
        for (int i = 1; i <= 300; i++) {
            String studentId = String.format("2024%04d", i);
            String name;
            
            // 确保姓名不重复
            do {
                name = firstNames[random.nextInt(firstNames.length)] + 
                       secondNames[random.nextInt(secondNames.length)];
            } while (usedNames.contains(name));
            
            usedNames.add(name);
            String gender = genders[random.nextInt(genders.length)];
            
            Student student = new Student(studentId, name, gender);
            allStudents.add(student);
            studentMap.put(studentId, student);
        }
        
        System.out.println("【完成】 创建了 " + allStudents.size() + " 个学生");
    }

    /**
     * 创建教师数据
     */
    private void createTeachers() {
        String[] teacherNames = {"王教授", "李教授", "张副教授", "刘讲师", "陈教授", "杨副教授", 
                                "赵讲师", "黄教授", "周副教授", "吴讲师"};
        
        for (int i = 1; i <= 10; i++) {
            String teacherId = String.format("T%03d", i);
            String name = teacherNames[i - 1];
            
            Teacher teacher = new Teacher(teacherId, name);
            allTeachers.add(teacher);
        }
    }

    /**
     * 创建课程数据
     */
    private void createCourses() {
        String[] courseNames = {"Java程序设计", "数据结构与算法", "计算机网络", "数据库原理", "操作系统"};
        
        for (int i = 0; i < courseNames.length; i++) {
            String courseId = String.format("C%03d", i + 1);
            Course course = new Course(courseId, courseNames[i]);
            allCourses.add(course);
        }
    }

    /**
     * 创建教学班数据
     */
    private void createTeachingClasses() {
        int classCounter = 1;
        
        // 每门课程至少有两位老师上课
        for (Course course : allCourses) {
            for (int i = 0; i < 2; i++) {
                String classId = String.format("CLASS%03d", classCounter);
                String semester = "2024春季";
                Teacher teacher = allTeachers.get((classCounter - 1 + i) % allTeachers.size());
                
                TeachingClass teachingClass = new TeachingClass(classId, semester, teacher, course);
                allTeachingClasses.add(teachingClass);
                teachingClassMap.put(classId, teachingClass);
                
                System.out.println("【完成】 创建教学班: " + classId + " - " + course.getCourseName() + " (" + teacher.getName() + ")");
                classCounter++;
            }
        }
    }

    /**
     * 为教学班分配学生
     */
    private void assignStudentsToClasses() {
        System.out.println("【设置】 开始分配学生到教学班...");
        
        // 先确保每个教学班至少有30个学生（平均分配）
        int studentsPerClass = allStudents.size() / allTeachingClasses.size();
        int currentStudentIndex = 0;
        
        // 均匀分配学生到各教学班
        for (TeachingClass teachingClass : allTeachingClasses) {
            for (int i = 0; i < studentsPerClass && currentStudentIndex < allStudents.size(); i++) {
                Student student = allStudents.get(currentStudentIndex++);
                teachingClass.addStudent(student);
            }
        }
        
        // 将剩余的学生随机分配
        while (currentStudentIndex < allStudents.size()) {
            TeachingClass randomClass = allTeachingClasses.get(random.nextInt(allTeachingClasses.size()));
            Student student = allStudents.get(currentStudentIndex++);
            randomClass.addStudent(student);
        }
        
        // 再随机增加一些学生到各班（让每个学生选修多门课程）
        for (Student student : allStudents) {
            int additionalClasses = 2 + random.nextInt(3); // 每个学生额外选2-4门课
            for (int i = 0; i < additionalClasses; i++) {
                TeachingClass randomClass = allTeachingClasses.get(random.nextInt(allTeachingClasses.size()));
                if (!randomClass.getStudents().contains(student)) {
                    randomClass.addStudent(student);
                }
            }
        }
        
        // 打印分配结果
        for (TeachingClass tc : allTeachingClasses) {
            System.out.println("【完成】 " + tc.getClassId() + " 分配了 " + tc.getStudents().size() + " 个学生");
        }
    }

    /**
     * 生成成绩数据
     */
    private void generateGrades() {
        for (TeachingClass teachingClass : allTeachingClasses) {
            for (Student student : teachingClass.getStudents()) {
                int regularScore = 60 + random.nextInt(41); // 60-100
                int midtermScore = 60 + random.nextInt(41); // 60-100
                int labScore = 60 + random.nextInt(41); // 60-100
                int finalExamScore = 60 + random.nextInt(41); // 60-100
                
                Grade grade = new Grade(student.getStudentId(), 
                                      teachingClass.getCourse().getCourseName(),
                                      regularScore, midtermScore, labScore, finalExamScore);
                allGrades.add(grade);
            }
        }
    }

    /**
     * 显示教学班成绩（支持排序）
     * @param classId 教学班号
     * @param sortByScore 是否按成绩排序
     */
    public void displayClassGradesWithSorting(String classId, boolean sortByScore) {
        TeachingClass teachingClass = teachingClassMap.get(classId);
        if (teachingClass == null) {
            printError("未找到教学班：" + classId);
            return;
        }
        
        System.out.println();
        printColoredLine("【学位帽】 " + classId + " 教学班成绩单", BOLD_CYAN);
        printSeparator(60, "=", CYAN);
        printInfo("课程：" + teachingClass.getCourse().getCourseName());
        printInfo("教师：" + teachingClass.getTeacher().getName());
        printInfo("学期：" + teachingClass.getSemester());
        printInfo("排序方式：" + (sortByScore ? "按综合成绩降序" : "按学号升序"));
        System.out.println();
        
        // 获取该教学班的所有成绩
        List<Grade> classGrades = new ArrayList<>();
        for (Student student : teachingClass.getStudents()) {
            for (Grade grade : allGrades) {
                if (grade.getStudentId().equals(student.getStudentId()) &&
                    grade.getCourseName().equals(teachingClass.getCourse().getCourseName())) {
                    classGrades.add(grade);
                }
            }
        }
        
        if (classGrades.isEmpty()) {
            printWarning("该教学班暂无成绩数据！");
            printInfo("教学班学生数：" + teachingClass.getStudents().size());
            printInfo("系统总成绩数：" + allGrades.size());
            return;
        }
        
        // 排序
        if (sortByScore) {
            classGrades.sort((g1, g2) -> Double.compare(g2.getComprehensiveScore(), g1.getComprehensiveScore()));
        } else {
            classGrades.sort(Comparator.comparing(Grade::getStudentId));
        }
        
        // 使用表格形式输出
        String[] headers = {"学号", "姓名", "平时", "期中", "实验", "期末", "综合成绩", "等级"};
        int[] widths = {12, 12, 8, 8, 8, 8, 10, 8};
        
        printTableHeader(headers, widths);
        
        for (int i = 0; i < classGrades.size(); i++) {
            Grade grade = classGrades.get(i);
            Student student = studentMap.get(grade.getStudentId());
            String gradeLevel = getGradeLevel(grade.getComprehensiveScore());
            
            String[] rowData = {
                grade.getStudentId(),
                student.getName(),
                String.valueOf(grade.getRegularScore()),
                String.valueOf(grade.getMidtermScore()),
                String.valueOf(grade.getLabScore()),
                String.valueOf(grade.getFinalExamScore()),
                String.format("%.2f", grade.getComprehensiveScore()),
                gradeLevel
            };
            printTableRow(rowData, widths, i % 2 == 0);
        }
        
        printTableFooter(widths);
        
        // 统计信息
        double avgScore = classGrades.stream().mapToDouble(Grade::getComprehensiveScore).average().orElse(0);
        double maxScore = classGrades.stream().mapToDouble(Grade::getComprehensiveScore).max().orElse(0);
        double minScore = classGrades.stream().mapToDouble(Grade::getComprehensiveScore).min().orElse(0);
        
        System.out.println();
        printColoredLine("【图表】 成绩统计：", BOLD_YELLOW);
        printInfo(String.format("平均分：%.2f  |  最高分：%.2f  |  最低分：%.2f  |  总人数：%d", 
                  avgScore, maxScore, minScore, classGrades.size()));
    }

    /**
     * 显示分数分布统计
     */
    public void displayScoreDistribution() {
        System.out.println();
        printColoredLine("【图表】 成绩分布统计分析", BOLD_CYAN);
        printGradientSeparator(50);
        
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("[90-100] 优秀", 0);
        distribution.put("[80-89] 良好", 0);
        distribution.put("[70-79] 中等", 0);
        distribution.put("[60-69] 及格", 0);
        distribution.put("[0-59] 不及格", 0);
        
        int totalGrades = allGrades.size();
        
        for (Grade grade : allGrades) {
            double score = grade.getComprehensiveScore();
            if (score >= 90) {
                distribution.put("[90-100] 优秀", distribution.get("[90-100] 优秀") + 1);
            } else if (score >= 80) {
                distribution.put("[80-89] 良好", distribution.get("[80-89] 良好") + 1);
            } else if (score >= 70) {
                distribution.put("[70-79] 中等", distribution.get("[70-79] 中等") + 1);
            } else if (score >= 60) {
                distribution.put("[60-69] 及格", distribution.get("[60-69] 及格") + 1);
            } else {
                distribution.put("[0-59] 不及格", distribution.get("[0-59] 不及格") + 1);
            }
        }
        
        String[] headers = {"分数段", "人数", "百分比", "可视化"};
        int[] widths = {18, 10, 10, 25};
        
        printTableHeader(headers, widths);
        
        int rowIndex = 0;
        for (Map.Entry<String, Integer> entry : distribution.entrySet()) {
            String range = entry.getKey();
            int count = entry.getValue();
            double percentage = (double) count / totalGrades * 100;
            
            // 创建可视化条形图
            int barLength = (int) (percentage / 5); // 每5%一个字符
            String bar = "■".repeat(Math.max(0, barLength)) + 
                        "□".repeat(Math.max(0, 20 - barLength));
            
            String[] rowData = {
                range,
                String.valueOf(count),
                String.format("%.2f%%", percentage),
                bar
            };
            printTableRow(rowData, widths, rowIndex % 2 == 0);
            rowIndex++;
        }
        
        printTableFooter(widths);
        
        System.out.println();
        printInfo("总成绩记录数：" + totalGrades + " 条");
        
        // 计算及格率
        long passCount = allGrades.stream()
                .filter(grade -> grade.getComprehensiveScore() >= 60)
                .count();
        double passRate = (double) passCount / totalGrades * 100;
        printSuccess(String.format("整体及格率：%.2f%% (%d/%d)", passRate, passCount, totalGrades));
    }

    /**
     * 查找学生成绩
     * @param studentIdOrName 学号或姓名
     */
    public void findStudentGrades(String studentIdOrName) {
        Student targetStudent = null;
        
        // 先按学号查找
        targetStudent = studentMap.get(studentIdOrName);
        
        // 如果没找到，按姓名查找
        if (targetStudent == null) {
            targetStudent = allStudents.stream()
                    .filter(student -> student.getName().equals(studentIdOrName))
                    .findFirst()
                    .orElse(null);
        }
        
        if (targetStudent == null) {
            System.out.println("未找到学生：" + studentIdOrName);
            return;
        }
        
        final String studentId = targetStudent.getStudentId(); // 使用final变量
        System.out.println();
        printColoredLine("【学位帽】 " + targetStudent.getName() + "(" + studentId + ") 的成绩单", BOLD_CYAN);
        printSeparator(50, "=", CYAN);
        printInfo("性别：" + targetStudent.getGender());
        System.out.println();
        
        List<Grade> studentGrades = allGrades.stream()
                .filter(grade -> grade.getStudentId().equals(studentId))
                .collect(Collectors.toList());
        
        if (studentGrades.isEmpty()) {
            printWarning("该学生暂无成绩记录");
            return;
        }
        
        String[] headers = {"课程名称", "平时", "期中", "实验", "期末", "综合成绩", "等级"};
        int[] widths = {18, 8, 8, 8, 8, 10, 8};
        
        printTableHeader(headers, widths);
        
        double totalScore = 0;
        for (int i = 0; i < studentGrades.size(); i++) {
            Grade grade = studentGrades.get(i);
            String gradeLevel = getGradeLevel(grade.getComprehensiveScore());
            
            String[] rowData = {
                grade.getCourseName(),
                String.valueOf(grade.getRegularScore()),
                String.valueOf(grade.getMidtermScore()),
                String.valueOf(grade.getLabScore()),
                String.valueOf(grade.getFinalExamScore()),
                String.format("%.2f", grade.getComprehensiveScore()),
                gradeLevel
            };
            printTableRow(rowData, widths, i % 2 == 0);
            totalScore += grade.getComprehensiveScore();
        }
        
        printTableFooter(widths);
        
        System.out.println();
        printColoredLine("【图表】 成绩汇总", BOLD_YELLOW);
        printInfo(String.format("总成绩：%.2f 分", totalScore));
        printInfo(String.format("平均成绩：%.2f 分", totalScore / studentGrades.size()));
        printInfo(String.format("选修课程：%d 门", studentGrades.size()));
        
        // 计算该学生在全体学生中的排名
        calculateStudentRank(studentId, totalScore);
    }

    /**
     * 计算单个学生的排名
     * @param studentId 学生ID
     * @param totalScore 总成绩
     */
    private void calculateStudentRank(String studentId, double totalScore) {
        // 计算所有学生的总成绩
        Map<String, Double> allTotalScores = new HashMap<>();
        for (Grade grade : allGrades) {
            String id = grade.getStudentId();
            allTotalScores.put(id, allTotalScores.getOrDefault(id, 0.0) + grade.getComprehensiveScore());
        }
        
        // 计算排名
        long rank = allTotalScores.values().stream()
                .filter(score -> score > totalScore)
                .count() + 1;
        
        printInfo(String.format("年级排名：第 %d 名 / 共 %d 人", rank, allStudents.size()));
    }
    
    /**
     * 显示所有学生排名
     */
    public void displayAllStudentRankings() {
        System.out.println();
        printColoredLine("【奖杯】 学生总成绩排行榜", BOLD_CYAN);
        printGradientSeparator(70);
        
        // 计算每个学生的总成绩
        Map<String, Double> studentTotalScores = new HashMap<>();
        Map<String, Integer> studentCourseCount = new HashMap<>();
        
        for (Grade grade : allGrades) {
            String studentId = grade.getStudentId();
            studentTotalScores.put(studentId, 
                    studentTotalScores.getOrDefault(studentId, 0.0) + grade.getComprehensiveScore());
            studentCourseCount.put(studentId, 
                    studentCourseCount.getOrDefault(studentId, 0) + 1);
        }
        
        // 创建排名列表
        List<Map.Entry<String, Double>> rankings = new ArrayList<>();
        for (Map.Entry<String, Double> entry : studentTotalScores.entrySet()) {
            rankings.add(entry);
        }
        
        // 按总成绩降序排序
        rankings.sort((e1, e2) -> Double.compare(e2.getValue(), e1.getValue()));
        
        String[] headers = {"排名", "学号", "姓名", "性别", "课程数", "总成绩", "平均成绩", "等级"};
        int[] widths = {6, 12, 10, 6, 8, 10, 10, 6};
        
        printTableHeader(headers, widths);
        
        // 只显示前50名，避免输出过多
        int displayCount = Math.min(50, rankings.size());
        for (int i = 0; i < displayCount; i++) {
            String studentId = rankings.get(i).getKey();
            double totalScore = rankings.get(i).getValue();
            int courseCount = studentCourseCount.get(studentId);
            double avgScore = totalScore / courseCount;
            Student student = studentMap.get(studentId);
            String gradeLevel = getGradeLevel(avgScore);
            
            // 前三名使用特殊颜色
            String[] rowData = {
                (i < 3) ? "【奖章】" + (i + 1) : String.valueOf(i + 1),
                studentId,
                student.getName(),
                student.getGender(),
                String.valueOf(courseCount),
                String.format("%.2f", totalScore),
                String.format("%.2f", avgScore),
                gradeLevel
            };
            printTableRow(rowData, widths, i % 2 == 0);
        }
        
        printTableFooter(widths);
        
        System.out.println();
        if (rankings.size() > displayCount) {
            printInfo(String.format("显示前 %d 名，共有 %d 名学生", displayCount, rankings.size()));
        } else {
            printInfo(String.format("共有 %d 名学生", rankings.size()));
        }
        
        // 显示前三名特别信息
        System.out.println();
        printColoredLine("【庆祝】 荣誉榜 - TOP 3", BOLD_YELLOW);
        for (int i = 0; i < Math.min(3, rankings.size()); i++) {
            String studentId = rankings.get(i).getKey();
            double totalScore = rankings.get(i).getValue();
            int courseCount = studentCourseCount.get(studentId);
            double avgScore = totalScore / courseCount;
            Student student = studentMap.get(studentId);
            
            String medal = i == 0 ? "【金牌】" : i == 1 ? "【银牌】" : "【铜牌】";
            printColoredLine(String.format("%s 第%d名：%s (%s) - 平均分：%.2f", 
                            medal, i + 1, student.getName(), studentId, avgScore), 
                            i == 0 ? BOLD_YELLOW : i == 1 ? BOLD_WHITE : BOLD_CYAN);
        }
    }

    /**
     * 获取成绩等级
     * @param score 分数
     * @return 等级
     */
    private String getGradeLevel(double score) {
        if (score >= 90) return "A";
        else if (score >= 80) return "B";
        else if (score >= 70) return "C";
        else if (score >= 60) return "D";
        else return "F";
    }
    
    /**
     * 显示系统统计信息
     */
    public void displaySystemStatistics() {
        System.out.println();
        printColoredLine("【图表】 系统整体统计信息", BOLD_CYAN);
        printGradientSeparator(50);
        
        // 基础统计
        printColoredLine("【上升】 基础数据统计", BOLD_YELLOW);
        printInfo("学生总数：" + allStudents.size() + " 人");
        printInfo("教师总数：" + allTeachers.size() + " 人");
        printInfo("课程总数：" + allCourses.size() + " 门");
        printInfo("教学班总数：" + allTeachingClasses.size() + " 个");
        printInfo("成绩记录总数：" + allGrades.size() + " 条");
        
        System.out.println();
        
        // 成绩统计
        double totalScore = allGrades.stream().mapToDouble(Grade::getComprehensiveScore).sum();
        double avgScore = allGrades.stream().mapToDouble(Grade::getComprehensiveScore).average().orElse(0);
        double maxScore = allGrades.stream().mapToDouble(Grade::getComprehensiveScore).max().orElse(0);
        double minScore = allGrades.stream().mapToDouble(Grade::getComprehensiveScore).min().orElse(0);
        
        printColoredLine("【目标】 成绩总体分析", BOLD_YELLOW);
        printInfo(String.format("总成绩：%.2f 分", totalScore));
        printInfo(String.format("平均成绩：%.2f 分", avgScore));
        printInfo(String.format("最高成绩：%.2f 分", maxScore));
        printInfo(String.format("最低成绩：%.2f 分", minScore));
        
        System.out.println();
        
        // 课程统计
        printColoredLine("【书本】 各课程选课情况", BOLD_YELLOW);
        for (Course course : allCourses) {
            long studentCount = allGrades.stream()
                    .filter(grade -> grade.getCourseName().equals(course.getCourseName()))
                    .count();
            double courseAvg = allGrades.stream()
                    .filter(grade -> grade.getCourseName().equals(course.getCourseName()))
                    .mapToDouble(Grade::getComprehensiveScore)
                    .average().orElse(0);
            printInfo(String.format("%s：%d人选修，平均分%.2f", 
                      course.getCourseName(), studentCount, courseAvg));
        }
        
        System.out.println();
        
        // 性别统计
        long maleCount = allStudents.stream().filter(s -> "男".equals(s.getGender())).count();
        long femaleCount = allStudents.stream().filter(s -> "女".equals(s.getGender())).count();
        
        printColoredLine("【人群】 学生性别分布", BOLD_YELLOW);
        printInfo(String.format("男生：%d人 (%.1f%%)", maleCount, (double)maleCount/allStudents.size()*100));
        printInfo(String.format("女生：%d人 (%.1f%%)", femaleCount, (double)femaleCount/allStudents.size()*100));
    }
    
    /**
     * 获取所有教学班列表
     * @return 教学班列表
     */
    public List<TeachingClass> getAllTeachingClasses() {
        return new ArrayList<>(allTeachingClasses);
    }
}

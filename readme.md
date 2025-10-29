README.md
项目名称：基于命令行的学生成绩管理系统
1. 项目概述
本项目旨在开发一个在Java环境下运行的命令行学生成绩管理系统 。系统将负责管理学生、教师、课程、教学班以及成绩等核心数据 。


核心约束: 本项目禁止使用任何数据库进行数据持久化 。所有数据都将在程序启动时动态生成，并完全存储在内存中，主要通过Java集合框架（如 ArrayList, HashMap）进行管理 。

2. 项目结构
请AI编程助手根据以下指定的包和类结构生成代码：

src
└── com
    └── yourname
        ├── model
        │   ├── Student.java
        │   ├── Teacher.java
        │   ├── Course.java
        │   ├── TeachingClass.java
        │   └── Grade.java
        ├── service
        │   └── EducationService.java
        ├── ui
        │   └── CommandLineUI.java
        └── Main.java
3. 实现细节
3.1. model 包 - 实体类
请创建以下实体类。要求所有属性均为 private，提供一个初始化所有属性的构造函数、所有属性的 public getter/setter 方法，并重写 toString() 方法以便于调试时打印对象信息。

Student.java


private String studentId; // 学号 


private String name; // 姓名 


private String gender; // 性别 

Teacher.java


private String teacherId; // 教师编号 


private String name; // 姓名 

Course.java


private String courseId; // 课程编号 


private String courseName; // 课程名字 

TeachingClass.java


private String classId; // 教学班号 


private String semester; // 开课学期 


private Teacher teacher; // 该教学班的任课教师对象 


private Course course; // 该教学班的课程对象 

private List<Student> students = new ArrayList<>(); // 该教学班的学生列表

Grade.java

private String studentId; // 关联学生的学号

private String courseName; // 关联课程的名称


private int regularScore; // 平时成绩 


private int midtermScore; // 期中考试成绩 


private int labScore; // 实验成绩 


private int finalExamScore; // 期末考试成绩 


private double comprehensiveScore; // 根据以上四项计算得出的综合成绩 


private java.time.LocalDateTime timestamp; // 记录成绩生成的时间 

3.2. service 包 - 业务逻辑层
EducationService.java

此类用于处理所有的数据管理和业务逻辑。请使用**单例设计模式（Singleton Pattern）**来实现，以确保全局只有一个数据源实例。

数据存储属性:

Java

private List<Student> allStudents = new ArrayList<>();
private List<Teacher> allTeachers = new ArrayList<>();
private List<Course> allCourses = new ArrayList<>();
private List<TeachingClass> allTeachingClasses = new ArrayList<>();
private List<Grade> allGrades = new ArrayList<>();
// 推荐使用Map以提高查询效率
private Map<String, Student> studentMap = new HashMap<>();
private Map<String, TeachingClass> teachingClassMap = new HashMap<>();
需要实现的方法:

public static EducationService getInstance(): 用于获取单例。


public void initializeData(): 核心数据生成方法 ，在此方法中完成：

创建并存储不少于100个学生对象 。

创建并存储不少于6个教师对象 。

创建并存储不少于3门课程对象 。

创建教学班 TeachingClass 对象。必须确保每门课程至少有两位老师上课（即每门课对应至少两个教学班） 。

实现学生选课逻辑：为教学班分配学生，确保每个教学班的学生数量不少于20人 ，并且每个学生至少选择3门课程 。

生成成绩：为每个学生在他所选的每个教学班中，生成一个Grade对象。随机生成四部分整数成绩，并根据自定义策略计算综合成绩 。

public void displayClassGradesWithSorting(String classId, boolean sortByScore):

根据 classId 查找教学班，获取其学生列表及对应成绩。

若 sortByScore 为 false，按学号排序 。

若 sortByScore 为 true，按综合成绩降序排序 。此处请务必使用 Lambda 表达式 来实现 Comparator 。

将排序后的结果格式化输出到控制台。

public void displayScoreDistribution():

统计所有成绩的 comprehensiveScore 的分数段分布（例如：[90-100], [80-89]...） 。

打印出各分数段的人数和百分比。

public void findStudentGrades(String studentIdOrName):

根据学号或姓名查询学生 。

找到后，打印该学生所有科目的成绩以及总成绩 。

public void displayAllStudentRankings():

计算每个学生的总成绩。

根据总成绩对所有学生进行排名，并格式化显示排名列表 。

3.3. ui 包 - 用户交互界面
CommandLineUI.java

此类负责处理所有的控制台输入和输出。

属性:

private EducationService educationService;

private java.util.Scanner scanner;

需要实现的方法:

public CommandLineUI(): 构造函数，通过EducationService.getInstance()初始化 educationService，并初始化 Scanner。

public void start():

在开始时，首先调用 educationService.initializeData() 初始化所有数据 。

进入一个无限 while 循环，作为程序的主循环。

在循环内，调用 displayMenu() 显示主菜单 。

读取用户输入，并使用 switch 语句根据用户的选择调用 service 层的相应方法。

private void displayMenu():

在控制台打印出清晰的主菜单，提示用户进行操作 。

3.4. Main.java - 程序入口
Main.java

public static void main(String[] args):

创建 CommandLineUI 的实例。

调用该实例的 start() 方法，启动整个应用程序。

4. 通用编程要求
请为所有 public 方法和类添加 Javadoc 注释。

在代码中适当应用继承、多态、接口、泛型等Java高级特性 。

确保控制台输出格式规范、清晰易读 。
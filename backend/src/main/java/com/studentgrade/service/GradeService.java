package com.studentgrade.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.studentgrade.entity.*;
import com.studentgrade.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 学生成绩管理服务 - 核心业务逻辑
 * 整合实验一的业务模型
 */
@Service
public class GradeService {

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private TeacherMapper teacherMapper;

    @Autowired
    private CourseMapper courseMapper;

    @Autowired
    private TeachingClassMapper teachingClassMapper;

    @Autowired
    private GradeMapper gradeMapper;

    // ==================== 学生管理 ====================

    public List<Student> getAllStudents() {
        return studentMapper.selectList(null);
    }

    public Student getStudentById(Long id) {
        return studentMapper.selectById(id);
    }

    public Student getStudentByStudentId(String studentId) {
        return studentMapper.selectOne(
                new QueryWrapper<Student>().eq("student_id", studentId));
    }

    public List<Student> searchStudents(String query) {
        return studentMapper.selectList(
                new QueryWrapper<Student>()
                        .like("student_id", query)
                        .or()
                        .like("name", query));
    }

    @Transactional
    public Student addStudent(String studentId, String name, String gender) {
        Student student = new Student();
        student.setStudentId(studentId);
        student.setName(name);
        student.setGender(gender);
        student.setDeleted(0);
        studentMapper.insert(student);
        return student;
    }

    @Transactional
    public Student updateStudent(String studentId, String name, String gender) {
        Student student = getStudentByStudentId(studentId);
        if (student != null) {
            student.setName(name);
            student.setGender(gender);
            studentMapper.updateById(student);
        }
        return student;
    }

    @Transactional
    public boolean deleteStudent(String studentId) {
        Student student = getStudentByStudentId(studentId);
        if (student != null) {
            studentMapper.deleteById(student.getId());
            return true;
        }
        return false;
    }

    // ==================== 课程管理 ====================

    public List<Course> getAllCourses() {
        return courseMapper.selectList(null);
    }

    public Course getCourseById(Long id) {
        return courseMapper.selectById(id);
    }

    public Course getCourseByCourseId(String courseId) {
        return courseMapper.selectOne(
                new QueryWrapper<Course>().eq("course_id", courseId));
    }

    // ==================== 教师管理 ====================

    public List<Teacher> getAllTeachers() {
        return teacherMapper.selectList(null);
    }

    public Teacher getTeacherById(Long id) {
        return teacherMapper.selectById(id);
    }

    public Teacher getTeacherByTeacherId(String teacherId) {
        return teacherMapper.selectOne(
                new QueryWrapper<Teacher>().eq("teacher_id", teacherId));
    }

    // ==================== 教学班管理 ====================

    public List<TeachingClass> getAllTeachingClasses() {
        return teachingClassMapper.selectList(null);
    }

    public TeachingClass getTeachingClassById(Long id) {
        return teachingClassMapper.selectById(id);
    }

    public TeachingClass getTeachingClassByClassId(String classId) {
        return teachingClassMapper.selectOne(
                new QueryWrapper<TeachingClass>().eq("class_id", classId));
    }

    // ==================== 成绩管理 ====================

    public List<Grade> getAllGrades() {
        return gradeMapper.selectList(null);
    }

    public List<Grade> getGradesByStudentId(Long studentId) {
        return gradeMapper.selectList(
                new QueryWrapper<Grade>().eq("student_id", studentId));
    }

    public List<Grade> getGradesByClassId(Long classId) {
        return gradeMapper.selectList(
                new QueryWrapper<Grade>().eq("class_id", classId));
    }

    @Transactional
    public Grade saveGrade(Long studentId, Long classId,
            Double regularScore, Double midtermScore,
            Double labScore, Double finalExamScore) {
        // 检查是否已存在成绩
        Grade existingGrade = gradeMapper.selectOne(
                new QueryWrapper<Grade>()
                        .eq("student_id", studentId)
                        .eq("class_id", classId));

        if (existingGrade != null) {
            // 更新成绩
            existingGrade.setRegularScore(regularScore);
            existingGrade.setMidtermScore(midtermScore);
            existingGrade.setLabScore(labScore);
            existingGrade.setFinalExamScore(finalExamScore);
            calculateComprehensiveScore(existingGrade);
            gradeMapper.updateById(existingGrade);
            return existingGrade;
        } else {
            // 新增成绩
            Grade grade = new Grade();
            grade.setStudentId(studentId);
            grade.setClassId(classId);
            grade.setRegularScore(regularScore);
            grade.setMidtermScore(midtermScore);
            grade.setLabScore(labScore);
            grade.setFinalExamScore(finalExamScore);
            grade.setCreatedTime(LocalDateTime.now());
            grade.setDeleted(0);
            calculateComprehensiveScore(grade);
            gradeMapper.insert(grade);
            return grade;
        }
    }

    @Transactional
    public boolean deleteGrade(Long studentId, Long classId) {
        return gradeMapper.delete(
                new QueryWrapper<Grade>()
                        .eq("student_id", studentId)
                        .eq("class_id", classId)) > 0;
    }

    // ==================== 统计分析 ====================

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // 基本统计
        Long studentCount = studentMapper.selectCount(null);
        Long teacherCount = teacherMapper.selectCount(null);
        Long courseCount = courseMapper.selectCount(null);
        Long classCount = teachingClassMapper.selectCount(null);
        Long gradeCount = gradeMapper.selectCount(null);

        stats.put("studentCount", studentCount);
        stats.put("totalStudents", studentCount); // 兼容前端
        stats.put("teacherCount", teacherCount);
        stats.put("courseCount", courseCount);
        stats.put("classCount", classCount);
        stats.put("gradeCount", gradeCount);
        stats.put("totalGrades", gradeCount); // 兼容前端

        // 计算平均分
        List<Grade> grades = getAllGrades();
        if (!grades.isEmpty()) {
            double avgScore = grades.stream()
                    .mapToDouble(Grade::getComprehensiveScore)
                    .average()
                    .orElse(0.0);
            stats.put("avgScore", Math.round(avgScore * 100) / 100.0);

            // 计算及格率
            long passCount = grades.stream()
                    .filter(g -> g.getComprehensiveScore() >= 60)
                    .count();
            double passRate = (passCount * 100.0 / grades.size());
            stats.put("passRate", Math.round(passRate * 100) / 100.0);

            // 计算优秀率
            long excellentCount = grades.stream()
                    .filter(g -> g.getComprehensiveScore() >= 90)
                    .count();
            double excellentRate = (excellentCount * 100.0 / grades.size());
            stats.put("excellentRate", Math.round(excellentRate * 100) / 100.0);

            // 最高分
            double maxScore = grades.stream()
                    .mapToDouble(Grade::getComprehensiveScore)
                    .max()
                    .orElse(0.0);
            stats.put("maxScore", Math.round(maxScore * 100) / 100.0);

            // 最低分
            double minScore = grades.stream()
                    .mapToDouble(Grade::getComprehensiveScore)
                    .min()
                    .orElse(0.0);
            stats.put("minScore", Math.round(minScore * 100) / 100.0);

            // 成绩分布
            Map<String, Long> distribution = new HashMap<>();
            distribution.put("优秀", grades.stream().filter(g -> g.getComprehensiveScore() >= 90).count());
            distribution.put("良好", grades.stream()
                    .filter(g -> g.getComprehensiveScore() >= 80 && g.getComprehensiveScore() < 90).count());
            distribution.put("中等", grades.stream()
                    .filter(g -> g.getComprehensiveScore() >= 70 && g.getComprehensiveScore() < 80).count());
            distribution.put("及格", grades.stream()
                    .filter(g -> g.getComprehensiveScore() >= 60 && g.getComprehensiveScore() < 70).count());
            distribution.put("不及格", grades.stream().filter(g -> g.getComprehensiveScore() < 60).count());
            stats.put("distribution", distribution);
        } else {
            stats.put("avgScore", 0.0);
            stats.put("passRate", 0.0);
            stats.put("excellentRate", 0.0);
            stats.put("maxScore", 0.0);
            stats.put("minScore", 0.0);
            stats.put("distribution", new HashMap<String, Long>() {
                {
                    put("优秀", 0L);
                    put("良好", 0L);
                    put("中等", 0L);
                    put("及格", 0L);
                    put("不及格", 0L);
                }
            });
        }

        return stats;
    }

    public Map<String, Integer> getGradeDistribution() {
        List<Grade> grades = getAllGrades();
        Map<String, Integer> distribution = new LinkedHashMap<>();

        distribution.put("优秀", 0);
        distribution.put("良好", 0);
        distribution.put("中等", 0);
        distribution.put("及格", 0);
        distribution.put("不及格", 0);

        for (Grade grade : grades) {
            double score = grade.getComprehensiveScore();
            if (score >= 90) {
                distribution.put("优秀", distribution.get("优秀") + 1);
            } else if (score >= 80) {
                distribution.put("良好", distribution.get("良好") + 1);
            } else if (score >= 70) {
                distribution.put("中等", distribution.get("中等") + 1);
            } else if (score >= 60) {
                distribution.put("及格", distribution.get("及格") + 1);
            } else {
                distribution.put("不及格", distribution.get("不及格") + 1);
            }
        }

        return distribution;
    }

    public List<Map<String, Object>> getRankings(int top) {
        List<Grade> grades = getAllGrades();

        // 按学生分组，计算平均分
        Map<Long, List<Grade>> gradesByStudent = grades.stream()
                .collect(Collectors.groupingBy(Grade::getStudentId));

        List<Map<String, Object>> rankings = new ArrayList<>();

        for (Map.Entry<Long, List<Grade>> entry : gradesByStudent.entrySet()) {
            Student student = getStudentById(entry.getKey());
            if (student == null)
                continue;

            double avgScore = entry.getValue().stream()
                    .mapToDouble(Grade::getComprehensiveScore)
                    .average()
                    .orElse(0.0);

            Map<String, Object> rank = new HashMap<>();
            rank.put("studentId", student.getStudentId());
            rank.put("name", student.getName());
            rank.put("avgScore", Math.round(avgScore * 100) / 100.0);
            rank.put("gradeCount", entry.getValue().size());
            rankings.add(rank);
        }

        // 按平均分降序排序
        rankings.sort((a, b) -> Double.compare(
                (Double) b.get("avgScore"),
                (Double) a.get("avgScore")));

        // 添加排名
        for (int i = 0; i < rankings.size(); i++) {
            rankings.get(i).put("rank", i + 1);
        }

        return rankings.stream().limit(top).collect(Collectors.toList());
    }

    // ==================== 辅助方法 ====================

    private void calculateComprehensiveScore(Grade grade) {
        double comprehensive = 0.0;

        if (grade.getRegularScore() != null) {
            comprehensive += grade.getRegularScore() * 0.2;
        }
        if (grade.getMidtermScore() != null) {
            comprehensive += grade.getMidtermScore() * 0.2;
        }
        if (grade.getLabScore() != null) {
            comprehensive += grade.getLabScore() * 0.3;
        }
        if (grade.getFinalExamScore() != null) {
            comprehensive += grade.getFinalExamScore() * 0.3;
        }

        BigDecimal bd = new BigDecimal(comprehensive).setScale(2, RoundingMode.HALF_UP);
        grade.setComprehensiveScore(bd.doubleValue());

        // 计算等级
        String level;
        if (comprehensive >= 90) {
            level = "优秀";
        } else if (comprehensive >= 80) {
            level = "良好";
        } else if (comprehensive >= 70) {
            level = "中等";
        } else if (comprehensive >= 60) {
            level = "及格";
        } else {
            level = "不及格";
        }
        grade.setLevel(level);
    }
}

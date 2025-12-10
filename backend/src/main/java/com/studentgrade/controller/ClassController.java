package com.studentgrade.controller;

import com.studentgrade.entity.*;
import com.studentgrade.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 教学班控制器
 */
@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private GradeService gradeService;

    /**
     * 获取所有教学班
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllClasses() {
        List<Map<String, Object>> classes = gradeService.getAllTeachingClasses().stream()
                .map(tc -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", tc.getId()); // 添加ID
                    map.put("classId", tc.getClassId());
                    map.put("semester", tc.getSemester());
                    map.put("courseId", tc.getCourseId());
                    map.put("teacherId", tc.getTeacherId());

                    // 获取课程详细信息
                    Course course = gradeService.getCourseById(tc.getCourseId());
                    if (course != null) {
                        Map<String, Object> courseMap = new HashMap<>();
                        courseMap.put("id", course.getId());
                        courseMap.put("courseId", course.getCourseId());
                        courseMap.put("courseName", course.getCourseName());
                        courseMap.put("credits", course.getCredits());
                        map.put("course", courseMap);
                        map.put("courseName", course.getCourseName()); // 保留兼容性
                    }

                    // 获取教师详细信息
                    Teacher teacher = gradeService.getTeacherById(tc.getTeacherId());
                    if (teacher != null) {
                        Map<String, Object> teacherMap = new HashMap<>();
                        teacherMap.put("id", teacher.getId());
                        teacherMap.put("teacherId", teacher.getTeacherId());
                        teacherMap.put("name", teacher.getName());
                        teacherMap.put("title", teacher.getTitle());
                        map.put("teacher", teacherMap);
                    }

                    // 计算该班级的平均分和学生数
                    List<Grade> grades = gradeService.getGradesByClassId(tc.getId());
                    double avgScore = grades.stream()
                            .mapToDouble(Grade::getComprehensiveScore)
                            .average()
                            .orElse(0.0);
                    map.put("avgScore", Math.round(avgScore * 100) / 100.0);
                    map.put("studentCount", grades.size());

                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(classes);
    }

    /**
     * 获取教学班详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getClassDetail(@PathVariable String id) {
        TeachingClass tc = gradeService.getTeachingClassByClassId(id);
        if (tc == null) {
            return ResponseEntity.status(404).body(Map.of("error", "教学班不存在"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("classId", tc.getClassId());
        result.put("semester", tc.getSemester());

        // 获取该班的成绩
        List<Grade> grades = gradeService.getGradesByClassId(tc.getId());

        // 成绩分布
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("优秀", 0);
        distribution.put("良好", 0);
        distribution.put("中等", 0);
        distribution.put("及格", 0);
        distribution.put("不及格", 0);

        for (Grade g : grades) {
            String level = g.getLevel();
            if (level != null && distribution.containsKey(level)) {
                distribution.put(level, distribution.get(level) + 1);
            }
        }

        result.put("distribution", distribution);
        result.put("studentCount", grades.size());

        return ResponseEntity.ok(result);
    }
}

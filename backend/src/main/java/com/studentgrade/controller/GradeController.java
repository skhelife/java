package com.studentgrade.controller;

import com.studentgrade.entity.*;
import com.studentgrade.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 成绩控制器 - 成绩录入与管理
 */
@RestController
@RequestMapping("/api/grades")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    /**
     * 录入/更新成绩
     */
    @PostMapping
    public ResponseEntity<?> saveGrade(@RequestBody Map<String, Object> request) {
        try {
            String studentIdStr = (String) request.get("studentId");
            String courseName = (String) request.get("courseName");

            // 分数可能是 Integer 或 Double
            Double regularScore = toDouble(request.get("regularScore"));
            Double midtermScore = toDouble(request.get("midtermScore"));
            Double labScore = toDouble(request.get("labScore"));
            Double finalExamScore = toDouble(request.get("finalExamScore"));

            // 查找学生
            Student student = gradeService.getStudentByStudentId(studentIdStr);
            if (student == null) {
                return ResponseEntity.status(404).body(Map.of("error", "学生不存在"));
            }

            // 根据课程名查找教学班
            TeachingClass teachingClass = gradeService.getAllTeachingClasses().stream()
                    .filter(tc -> {
                        Course course = gradeService.getCourseById(tc.getCourseId());
                        return course != null && course.getCourseName().equals(courseName);
                    })
                    .findFirst()
                    .orElse(null);

            if (teachingClass == null) {
                return ResponseEntity.status(404).body(Map.of("error", "课程不存在"));
            }

            Grade grade = gradeService.saveGrade(
                    student.getId(),
                    teachingClass.getId(),
                    regularScore,
                    midtermScore,
                    labScore,
                    finalExamScore);

            return ResponseEntity.ok(Map.of(
                    "message", "成绩保存成功",
                    "comprehensiveScore", grade.getComprehensiveScore(),
                    "level", grade.getLevel()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 删除成绩
     */
    @DeleteMapping("/{studentId}/{courseName}")
    public ResponseEntity<?> deleteGrade(@PathVariable String studentId,
            @PathVariable String courseName) {
        try {
            Student student = gradeService.getStudentByStudentId(studentId);
            if (student == null) {
                return ResponseEntity.status(404).body(Map.of("error", "学生不存在"));
            }

            // 根据课程名查找教学班
            TeachingClass teachingClass = gradeService.getAllTeachingClasses().stream()
                    .filter(tc -> {
                        Course course = gradeService.getCourseById(tc.getCourseId());
                        return course != null && course.getCourseName().equals(courseName);
                    })
                    .findFirst()
                    .orElse(null);

            if (teachingClass == null) {
                return ResponseEntity.status(404).body(Map.of("error", "课程不存在"));
            }

            boolean deleted = gradeService.deleteGrade(student.getId(), teachingClass.getId());
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "成绩删除成功"));
            }
            return ResponseEntity.status(404).body(Map.of("error", "成绩不存在"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Double toDouble(Object value) {
        if (value == null)
            return 0.0;
        if (value instanceof Number) {
            return ((Number) value).doubleValue();
        }
        return Double.parseDouble(value.toString());
    }
}

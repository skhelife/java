package com.studentgrade.controller;

import com.studentgrade.entity.Course;
import com.studentgrade.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 课程控制器
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private GradeService gradeService;

    /**
     * 获取所有课程
     */
    @GetMapping
    public ResponseEntity<List<Map<String, String>>> getAllCourses() {
        List<Map<String, String>> courses = gradeService.getAllCourses().stream()
                .map(course -> {
                    Map<String, String> map = new HashMap<>();
                    map.put("courseId", course.getCourseId());
                    map.put("courseName", course.getCourseName());
                    map.put("credits", String.valueOf(course.getCredits()));
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(courses);
    }

    /**
     * 获取课程详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourse(@PathVariable String id) {
        Course course = gradeService.getCourseByCourseId(id);
        if (course == null) {
            return ResponseEntity.status(404).body(Map.of("error", "课程不存在"));
        }
        return ResponseEntity.ok(course);
    }
}

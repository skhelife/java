package com.studentgrade.controller;

import com.studentgrade.entity.Student;
import com.studentgrade.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 学生控制器 - 对应前端 API
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private GradeService gradeService;

    /**
     * 获取所有学生
     */
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(gradeService.getAllStudents());
    }

    /**
     * 搜索学生
     */
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam("q") String query) {
        return ResponseEntity.ok(gradeService.searchStudents(query));
    }

    /**
     * 获取学生详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable String id) {
        Student student = gradeService.getStudentByStudentId(id);
        if (student == null) {
            return ResponseEntity.status(404).body(Map.of("error", "学生不存在"));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("studentId", student.getStudentId());
        result.put("name", student.getName());
        result.put("gender", student.getGender());

        // 获取学生成绩
        var grades = gradeService.getGradesByStudentId(student.getId());
        result.put("grades", grades);
        result.put("gradeCount", grades.size());

        // 计算平均分
        double avgScore = grades.stream()
                .mapToDouble(g -> g.getComprehensiveScore())
                .average()
                .orElse(0.0);
        result.put("avgScore", Math.round(avgScore * 100) / 100.0);

        return ResponseEntity.ok(result);
    }

    /**
     * 添加学生
     */
    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody Map<String, String> request) {
        try {
            String studentId = request.get("studentId");
            String name = request.get("name");
            String gender = request.get("gender");

            if (studentId == null || name == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "学号和姓名不能为空"));
            }

            Student student = gradeService.addStudent(studentId, name, gender);
            return ResponseEntity.ok(student);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 更新学生
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String gender = request.get("gender");

            Student student = gradeService.updateStudent(id, name, gender);
            if (student == null) {
                return ResponseEntity.status(404).body(Map.of("error", "学生不存在"));
            }
            return ResponseEntity.ok(student);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 删除学生
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        boolean deleted = gradeService.deleteStudent(id);
        if (deleted) {
            return ResponseEntity.ok(Map.of("message", "删除成功"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "学生不存在"));
    }
}

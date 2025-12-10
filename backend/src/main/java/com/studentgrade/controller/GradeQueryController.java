package com.studentgrade.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.studentgrade.entity.Grade;
import com.studentgrade.entity.Student;
import com.studentgrade.entity.TeachingClass;
import com.studentgrade.mapper.GradeMapper;
import com.studentgrade.mapper.StudentMapper;
import com.studentgrade.mapper.TeachingClassMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 成绩查询控制器 - 提供分页和筛选功能
 */
@RestController
@RequestMapping("/api/grades")
public class GradeQueryController {

    @Autowired
    private GradeMapper gradeMapper;

    @Autowired
    private StudentMapper studentMapper;

    @Autowired
    private TeachingClassMapper teachingClassMapper;

    /**
     * 分页查询成绩列表
     */
    @GetMapping
    public ResponseEntity<?> getGrades(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Double minScore,
            @RequestParam(required = false) Double maxScore) {
        try {
            // 构建查询条件
            QueryWrapper<Grade> queryWrapper = new QueryWrapper<>();

            if (studentId != null) {
                queryWrapper.eq("student_id", studentId);
            }

            if (classId != null) {
                queryWrapper.eq("class_id", classId);
            }

            if (minScore != null) {
                queryWrapper.ge("comprehensive_score", minScore);
            }

            if (maxScore != null) {
                queryWrapper.le("comprehensive_score", maxScore);
            }

            // 按创建时间倒序
            queryWrapper.orderByDesc("created_time");

            // 分页查询
            Page<Grade> pageRequest = new Page<>(page, size);
            IPage<Grade> result = gradeMapper.selectPage(pageRequest, queryWrapper);

            // 填充关联数据
            List<Map<String, Object>> gradeList = result.getRecords().stream().map(grade -> {
                Map<String, Object> gradeMap = new HashMap<>();
                gradeMap.put("id", grade.getId());
                gradeMap.put("regularScore", grade.getRegularScore());
                gradeMap.put("midtermScore", grade.getMidtermScore());
                gradeMap.put("labScore", grade.getLabScore());
                gradeMap.put("finalExamScore", grade.getFinalExamScore());
                gradeMap.put("comprehensiveScore", grade.getComprehensiveScore());
                gradeMap.put("level", grade.getLevel());
                gradeMap.put("createdTime", grade.getCreatedTime());

                // 填充学生信息
                Student student = studentMapper.selectById(grade.getStudentId());
                if (student != null) {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", student.getId());
                    studentMap.put("studentId", student.getStudentId());
                    studentMap.put("name", student.getName());
                    studentMap.put("gender", student.getGender());
                    gradeMap.put("student", studentMap);
                }

                // 填充教学班信息
                TeachingClass teachingClass = teachingClassMapper.selectById(grade.getClassId());
                if (teachingClass != null) {
                    Map<String, Object> classMap = new HashMap<>();
                    classMap.put("id", teachingClass.getId());
                    classMap.put("classId", teachingClass.getClassId());
                    gradeMap.put("teachingClass", classMap);
                }

                return gradeMap;
            }).collect(Collectors.toList());

            // 构建返回结果
            Map<String, Object> response = new HashMap<>();
            Map<String, Object> data = new HashMap<>();
            data.put("content", gradeList);
            data.put("totalElements", result.getTotal());
            data.put("totalPages", result.getPages());
            data.put("currentPage", result.getCurrent());
            data.put("pageSize", result.getSize());

            response.put("success", true);
            response.put("data", data);
            response.put("message", "查询成功");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * 查询所有成绩（不分页）
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllGrades() {
        try {
            List<Grade> grades = gradeMapper.selectList(
                    new QueryWrapper<Grade>().orderByDesc("created_time"));

            // 填充关联数据
            List<Map<String, Object>> gradeList = grades.stream().map(grade -> {
                Map<String, Object> gradeMap = new HashMap<>();
                gradeMap.put("id", grade.getId());
                gradeMap.put("regularScore", grade.getRegularScore());
                gradeMap.put("midtermScore", grade.getMidtermScore());
                gradeMap.put("labScore", grade.getLabScore());
                gradeMap.put("finalExamScore", grade.getFinalExamScore());
                gradeMap.put("comprehensiveScore", grade.getComprehensiveScore());
                gradeMap.put("level", grade.getLevel());
                gradeMap.put("createdTime", grade.getCreatedTime());

                // 填充学生信息
                Student student = studentMapper.selectById(grade.getStudentId());
                if (student != null) {
                    Map<String, Object> studentMap = new HashMap<>();
                    studentMap.put("id", student.getId());
                    studentMap.put("studentId", student.getStudentId());
                    studentMap.put("name", student.getName());
                    studentMap.put("gender", student.getGender());
                    gradeMap.put("student", studentMap);
                }

                // 填充教学班信息
                TeachingClass teachingClass = teachingClassMapper.selectById(grade.getClassId());
                if (teachingClass != null) {
                    Map<String, Object> classMap = new HashMap<>();
                    classMap.put("id", teachingClass.getId());
                    classMap.put("classId", teachingClass.getClassId());
                    gradeMap.put("teachingClass", classMap);
                }

                return gradeMap;
            }).collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", gradeList);
            response.put("message", "查询成功");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "查询失败: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}

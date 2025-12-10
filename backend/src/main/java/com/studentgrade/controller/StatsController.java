package com.studentgrade.controller;

import com.studentgrade.service.GradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 统计控制器 - 数据统计与排行榜
 */
@RestController
@RequestMapping("/api")
public class StatsController {

    @Autowired
    private GradeService gradeService;

    /**
     * 获取系统统计数据
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", gradeService.getStatistics());
        response.put("message", "统计数据获取成功");
        return ResponseEntity.ok(response);
    }

    /**
     * 获取成绩分布
     */
    @GetMapping("/stats/distribution")
    public ResponseEntity<Map<String, Object>> getDistribution() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", gradeService.getGradeDistribution());
        response.put("message", "成绩分布获取成功");
        return ResponseEntity.ok(response);
    }

    /**
     * 获取排行榜
     */
    @GetMapping("/rankings")
    public ResponseEntity<Map<String, Object>> getRankings(
            @RequestParam(value = "top", defaultValue = "100") int top) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", gradeService.getRankings(top));
        response.put("message", "排行榜获取成功");
        return ResponseEntity.ok(response);
    }
}

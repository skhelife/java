package com.studentgrade.controller;

import com.studentgrade.entity.SystemLog;
import com.studentgrade.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统日志控制器
 */
@RestController
@RequestMapping("/api/logs")
public class LogController {

    @Autowired
    private UserService userService;

    /**
     * 获取系统日志
     */
    @GetMapping
    public ResponseEntity<List<SystemLog>> getLogs(
            @RequestParam(value = "limit", defaultValue = "100") int limit) {
        return ResponseEntity.ok(userService.getSystemLogs(limit));
    }
}

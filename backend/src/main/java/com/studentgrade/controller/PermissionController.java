package com.studentgrade.controller;

import com.studentgrade.entity.Permission;
import com.studentgrade.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 权限管理控制器
 */
@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    @Autowired
    private UserService userService;

    /**
     * 获取所有权限
     */
    @GetMapping
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(userService.getAllPermissions());
    }
}

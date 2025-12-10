package com.studentgrade.controller;

import com.studentgrade.entity.*;
import com.studentgrade.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理控制器
 */
@RestController
@RequestMapping("/api/roles")
public class RoleController {

    @Autowired
    private UserService userService;

    /**
     * 获取所有角色
     */
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(userService.getAllRoles());
    }

    /**
     * 获取角色权限
     */
    @GetMapping("/{id}/permissions")
    public ResponseEntity<List<Permission>> getRolePermissions(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getRolePermissions(id));
    }
}

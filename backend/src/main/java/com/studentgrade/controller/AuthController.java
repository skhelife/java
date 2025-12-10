package com.studentgrade.controller;

import com.studentgrade.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 认证控制器 - 处理登录/注册
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "用户名和密码不能为空"));
            }

            Map<String, Object> result = userService.login(username, password);
            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            String email = request.get("email");
            String fullName = request.get("fullName");

            if (username == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "用户名和密码不能为空"));
            }

            userService.createUser(username, password, email, fullName);
            return ResponseEntity.ok(Map.of("message", "注册成功"));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * 验证 Token
     */
    @GetMapping("/verify")
    public ResponseEntity<?> verify() {
        return ResponseEntity.ok(Map.of("valid", true));
    }
}

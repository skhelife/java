package com.studentgrade.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.studentgrade.entity.*;
import com.studentgrade.mapper.*;
import com.studentgrade.util.JwtUtil;
import com.studentgrade.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 用户认证与权限管理服务
 * 整合实验二的权限管理模型
 */
@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Autowired
    private PermissionMapper permissionMapper;

    @Autowired
    private SystemLogMapper systemLogMapper;

    @Autowired
    private JwtUtil jwtUtil;

    // ==================== 用户认证 ====================

    public Map<String, Object> login(String username, String password) {
        User user = userMapper.selectOne(
                new QueryWrapper<User>().eq("username", username));

        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new RuntimeException("用户已被禁用");
        }

        // 验证密码
        String passwordHash = PasswordUtil.hashPassword(password, user.getSalt());
        if (!passwordHash.equals(user.getPasswordHash())) {
            // 增加失败次数
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setStatus("LOCKED");
            }
            userMapper.updateById(user);
            throw new RuntimeException("密码错误");
        }

        // 登录成功
        user.setFailedLoginAttempts(0);
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);

        // 获取用户角色和权限
        List<Role> roles = roleMapper.findRolesByUserId(user.getId());
        Set<String> permissions = new HashSet<>();
        for (Role role : roles) {
            List<Permission> perms = permissionMapper.findPermissionsByRoleId(role.getId());
            permissions.addAll(perms.stream()
                    .map(Permission::getPermissionCode)
                    .collect(Collectors.toList()));
        }

        // 生成 JWT Token
        String token = jwtUtil.generateToken(user.getUsername(),
                roles.stream().map(Role::getRoleCode).collect(Collectors.toList()),
                new ArrayList<>(permissions));

        // 记录登录日志
        logOperation(user.getId(), user.getUsername(), "LOGIN", "USER", user.getId(),
                "用户登录成功", "SUCCESS");

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "fullName", user.getFullName() != null ? user.getFullName() : user.getUsername(),
                "email", user.getEmail()));
        result.put("roles", roles.stream().map(Role::getRoleCode).collect(Collectors.toList()));
        result.put("permissions", permissions);

        return result;
    }

    // ==================== 用户管理 ====================

    public List<User> getAllUsers() {
        return userMapper.selectList(null);
    }

    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    public User getUserByUsername(String username) {
        return userMapper.selectOne(
                new QueryWrapper<User>().eq("username", username));
    }

    @Transactional
    public User createUser(String username, String password, String email, String fullName) {
        // 检查用户名是否已存在
        if (getUserByUsername(username) != null) {
            throw new RuntimeException("用户名已存在");
        }

        String salt = PasswordUtil.generateSalt();
        String passwordHash = PasswordUtil.hashPassword(password, salt);

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordHash);
        user.setSalt(salt);
        user.setEmail(email);
        user.setFullName(fullName);
        user.setStatus("ACTIVE");
        user.setFailedLoginAttempts(0);
        user.setCreatedTime(LocalDateTime.now());
        user.setUpdatedTime(LocalDateTime.now());

        userMapper.insert(user);
        return user;
    }

    @Transactional
    public User updateUser(Long id, String email, String fullName) {
        User user = getUserById(id);
        if (user != null) {
            user.setEmail(email);
            user.setFullName(fullName);
            user.setUpdatedTime(LocalDateTime.now());
            userMapper.updateById(user);
        }
        return user;
    }

    @Transactional
    public boolean deleteUser(Long id) {
        return userMapper.deleteById(id) > 0;
    }

    // ==================== 角色管理 ====================

    public List<Role> getAllRoles() {
        return roleMapper.selectList(null);
    }

    public Role getRoleById(Long id) {
        return roleMapper.selectById(id);
    }

    public List<Role> getUserRoles(Long userId) {
        return roleMapper.findRolesByUserId(userId);
    }

    // ==================== 权限管理 ====================

    public List<Permission> getAllPermissions() {
        return permissionMapper.selectList(null);
    }

    public List<Permission> getRolePermissions(Long roleId) {
        return permissionMapper.findPermissionsByRoleId(roleId);
    }

    public Set<String> getUserPermissions(Long userId) {
        List<Role> roles = roleMapper.findRolesByUserId(userId);
        Set<String> permissions = new HashSet<>();
        for (Role role : roles) {
            List<Permission> perms = permissionMapper.findPermissionsByRoleId(role.getId());
            permissions.addAll(perms.stream()
                    .map(Permission::getPermissionCode)
                    .collect(Collectors.toList()));
        }
        return permissions;
    }

    // ==================== 日志管理 ====================

    public List<SystemLog> getSystemLogs(int limit) {
        return systemLogMapper.selectList(
                new QueryWrapper<SystemLog>()
                        .orderByDesc("created_time")
                        .last("LIMIT " + limit));
    }

    public void logOperation(Long userId, String username, String operationType,
            String targetType, Long targetId, String desc, String result) {
        SystemLog log = new SystemLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setOperationType(operationType);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setOperationDesc(desc);
        log.setExecutionResult(result);
        log.setCreatedTime(LocalDateTime.now());
        systemLogMapper.insert(log);
    }
}

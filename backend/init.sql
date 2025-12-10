-- ============================================================
-- 学生成绩管理系统 - 数据库初始化脚本 (增强版)
-- 实验四：Spring Boot 后端实现
-- 包含: 300名学生 + 完整权限系统 + 审计日志
-- ============================================================

-- 删除并重建数据库（确保干净环境）
DROP DATABASE IF EXISTS student_grade_system;
CREATE DATABASE student_grade_system 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE student_grade_system;

-- ==================== 实验一: 学生成绩管理表 ====================

-- 学生表
CREATE TABLE student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) UNIQUE NOT NULL COMMENT '学号',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    gender VARCHAR(20) COMMENT '性别',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除标记'
) COMMENT='学生信息表';

-- 教师表
CREATE TABLE teacher (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    teacher_id VARCHAR(20) UNIQUE NOT NULL COMMENT '教师编号',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    title VARCHAR(50) COMMENT '职称',
    deleted TINYINT DEFAULT 0
) COMMENT='教师信息表';

-- 课程表
CREATE TABLE course (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id VARCHAR(20) UNIQUE NOT NULL COMMENT '课程编号',
    course_name VARCHAR(100) NOT NULL COMMENT '课程名称',
    credits INT COMMENT '学分',
    deleted TINYINT DEFAULT 0
) COMMENT='课程信息表';

-- 教学班表
CREATE TABLE teaching_class (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    class_id VARCHAR(50) UNIQUE NOT NULL COMMENT '教学班编号',
    semester VARCHAR(20) COMMENT '学期',
    course_id BIGINT COMMENT '课程ID',
    teacher_id BIGINT COMMENT '教师ID',
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES course(id),
    FOREIGN KEY (teacher_id) REFERENCES teacher(id)
) COMMENT='教学班信息表';

-- 成绩表
CREATE TABLE grade (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL COMMENT '学生ID',
    class_id BIGINT NOT NULL COMMENT '教学班ID',
    regular_score DOUBLE COMMENT '平时成绩',
    midterm_score DOUBLE COMMENT '期中成绩',
    lab_score DOUBLE COMMENT '实验成绩',
    final_exam_score DOUBLE COMMENT '期末成绩',
    comprehensive_score DOUBLE COMMENT '综合成绩',
    level VARCHAR(20) COMMENT '等级',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted TINYINT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES student(id),
    FOREIGN KEY (class_id) REFERENCES teaching_class(id)
) COMMENT='成绩信息表';

-- ==================== 实验二: 权限管理表 ====================

-- 用户表
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    salt VARCHAR(255) NOT NULL COMMENT '盐值',
    email VARCHAR(100) COMMENT '邮箱',
    full_name VARCHAR(100) COMMENT '全名',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    last_login_time DATETIME COMMENT '最后登录时间',
    failed_login_attempts INT DEFAULT 0 COMMENT '失败登录次数',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='用户表';

-- 角色表
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) UNIQUE NOT NULL COMMENT '角色代码',
    description VARCHAR(255) COMMENT '描述',
    is_system_role BOOLEAN DEFAULT FALSE COMMENT '是否系统角色',
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT '状态',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) COMMENT='角色表';

-- 权限表
CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    permission_code VARCHAR(100) UNIQUE NOT NULL COMMENT '权限代码',
    permission_name VARCHAR(100) NOT NULL COMMENT '权限名称',
    resource_type VARCHAR(50) COMMENT '资源类型',
    description VARCHAR(255) COMMENT '描述',
    parent_id BIGINT COMMENT '父权限ID',
    is_system_permission BOOLEAN DEFAULT FALSE COMMENT '是否系统权限',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT='权限表';

-- 用户-角色关联表
CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_role (user_id, role_id)
) COMMENT='用户角色关联表';

-- 角色-权限关联表
CREATE TABLE role_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    assigned_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_permission (role_id, permission_id)
) COMMENT='角色权限关联表';

-- 系统日志表
CREATE TABLE system_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) COMMENT '用户名',
    operation_type VARCHAR(50) COMMENT '操作类型',
    target_type VARCHAR(50) COMMENT '目标类型',
    target_id BIGINT COMMENT '目标ID',
    operation_desc VARCHAR(500) COMMENT '操作描述',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    execution_result VARCHAR(20) COMMENT '执行结果',
    error_message TEXT COMMENT '错误信息',
    execution_time_ms BIGINT COMMENT '执行时间(毫秒)',
    created_time DATETIME DEFAULT CURRENT_TIMESTAMP
) COMMENT='系统日志表';

-- ==================== 插入测试数据 ====================

-- ========== 1. 学生数据 (300名) ==========
-- 使用存储过程批量生成300名学生
DELIMITER $$
CREATE PROCEDURE generate_students()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE student_name VARCHAR(50);
    DECLARE student_gender VARCHAR(10);
    
    WHILE i <= 300 DO
        -- 生成学生姓名
        SET student_name = CONCAT('学生', LPAD(i, 3, '0'));
        
        -- 随机性别
        IF i % 2 = 0 THEN
            SET student_gender = '女';
        ELSE
            SET student_gender = '男';
        END IF;
        
        -- 插入学生记录
        INSERT INTO student (student_id, name, gender) 
        VALUES (CONCAT('2023', LPAD(i, 4, '0')), student_name, student_gender);
        
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

-- 调用存储过程生成学生数据
CALL generate_students();
DROP PROCEDURE generate_students;

-- ========== 2. 教师数据 (20名) ==========
INSERT INTO teacher (teacher_id, name, title) VALUES
('T001', '刘教授', '教授'),
('T002', '陈老师', '副教授'),
('T003', '杨老师', '讲师'),
('T004', '王教授', '教授'),
('T005', '赵老师', '副教授'),
('T006', '李老师', '讲师'),
('T007', '周教授', '教授'),
('T008', '吴老师', '副教授'),
('T009', '郑老师', '讲师'),
('T010', '孙教授', '教授'),
('T011', '钱老师', '副教授'),
('T012', '徐老师', '讲师'),
('T013', '马教授', '教授'),
('T014', '朱老师', '副教授'),
('T015', '胡老师', '讲师'),
('T016', '林教授', '教授'),
('T017', '何老师', '副教授'),
('T018', '高老师', '讲师'),
('T019', '梁教授', '教授'),
('T020', '宋老师', '副教授');

-- ========== 3. 课程数据 (15门) ==========
INSERT INTO course (course_id, course_name, credits) VALUES
('C001', '高等数学A', 5),
('C002', '大学英语', 3),
('C003', 'Java程序设计', 4),
('C004', '数据结构与算法', 4),
('C005', '数据库原理', 3),
('C006', '计算机网络', 4),
('C007', '操作系统', 4),
('C008', '软件工程', 3),
('C009', '人工智能导论', 3),
('C010', 'Web前端开发', 3),
('C011', '线性代数', 4),
('C012', '概率论与数理统计', 3),
('C013', '离散数学', 3),
('C014', '编译原理', 4),
('C015', '计算机组成原理', 4);

-- ========== 4. 教学班数据 (30个班级) ==========
INSERT INTO teaching_class (class_id, semester, course_id, teacher_id) VALUES
('2023春-C001-01', '2023春季', 1, 1),
('2023春-C001-02', '2023春季', 1, 4),
('2023春-C002-01', '2023春季', 2, 2),
('2023春-C002-02', '2023春季', 2, 5),
('2023春-C003-01', '2023春季', 3, 3),
('2023春-C003-02', '2023春季', 3, 6),
('2023春-C004-01', '2023春季', 4, 7),
('2023春-C005-01', '2023春季', 5, 8),
('2023春-C006-01', '2023春季', 6, 9),
('2023春-C007-01', '2023春季', 7, 10),
('2023秋-C001-01', '2023秋季', 1, 1),
('2023秋-C002-01', '2023秋季', 2, 2),
('2023秋-C003-01', '2023秋季', 3, 3),
('2023秋-C004-01', '2023秋季', 4, 4),
('2023秋-C005-01', '2023秋季', 5, 5),
('2023秋-C008-01', '2023秋季', 8, 11),
('2023秋-C009-01', '2023秋季', 9, 12),
('2023秋-C010-01', '2023秋季', 10, 13),
('2024春-C011-01', '2024春季', 11, 14),
('2024春-C012-01', '2024春季', 12, 15),
('2024春-C013-01', '2024春季', 13, 16),
('2024春-C014-01', '2024春季', 14, 17),
('2024春-C015-01', '2024春季', 15, 18),
('2024春-C003-01', '2024春季', 3, 19),
('2024春-C005-01', '2024春季', 5, 20),
('2024春-C006-01', '2024春季', 6, 1),
('2024春-C007-01', '2024春季', 7, 2),
('2024春-C008-01', '2024春季', 8, 3),
('2024春-C009-01', '2024春季', 9, 4),
('2024春-C010-01', '2024春季', 10, 5);

-- ========== 5. 成绩数据 (为300名学生生成成绩) ==========
-- 每个学生随机选3-5门课程
DELIMITER $$
CREATE PROCEDURE generate_grades()
BEGIN
    DECLARE student_count INT DEFAULT 1;
    DECLARE course_num INT;
    DECLARE class_idx INT;
    DECLARE regular DOUBLE;
    DECLARE midterm DOUBLE;
    DECLARE lab DOUBLE;
    DECLARE final_exam DOUBLE;
    DECLARE comprehensive DOUBLE;
    DECLARE grade_level VARCHAR(20);
    
    WHILE student_count <= 300 DO
        -- 每个学生选3-5门课程
        SET course_num = 3 + FLOOR(RAND() * 3);
        
        -- 为当前学生生成多门课程成绩
        WHILE course_num > 0 DO
            -- 随机选择一个教学班 (1-30)
            SET class_idx = 1 + FLOOR(RAND() * 30);
            
            -- 生成随机成绩 (60-100分)
            SET regular = 60 + RAND() * 40;
            SET midterm = 60 + RAND() * 40;
            SET lab = 60 + RAND() * 40;
            SET final_exam = 60 + RAND() * 40;
            
            -- 计算综合成绩 (平时20% + 期中20% + 实验20% + 期末40%)
            SET comprehensive = regular * 0.2 + midterm * 0.2 + lab * 0.2 + final_exam * 0.4;
            
            -- 确定等级
            IF comprehensive >= 90 THEN
                SET grade_level = '优秀';
            ELSEIF comprehensive >= 80 THEN
                SET grade_level = '良好';
            ELSEIF comprehensive >= 70 THEN
                SET grade_level = '中等';
            ELSEIF comprehensive >= 60 THEN
                SET grade_level = '及格';
            ELSE
                SET grade_level = '不及格';
            END IF;
            
            -- 插入成绩记录（避免重复）
            INSERT IGNORE INTO grade (student_id, class_id, regular_score, midterm_score, 
                                     lab_score, final_exam_score, comprehensive_score, level)
            VALUES (student_count, class_idx, 
                    ROUND(regular, 1), ROUND(midterm, 1), 
                    ROUND(lab, 1), ROUND(final_exam, 1), 
                    ROUND(comprehensive, 1), grade_level);
            
            SET course_num = course_num - 1;
        END WHILE;
        
        SET student_count = student_count + 1;
    END WHILE;
END$$
DELIMITER ;

-- 调用存储过程生成成绩数据
CALL generate_grades();
DROP PROCEDURE generate_grades;

-- ========== 6. 角色数据 (增强版) ==========
INSERT INTO roles (role_name, role_code, description, is_system_role, status) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限', TRUE, 'ACTIVE'),
('管理员', 'ADMIN', '普通管理员，负责日常管理', TRUE, 'ACTIVE'),
('教务管理员', 'ACADEMIC_ADMIN', '教务处管理员，管理课程和教学班', FALSE, 'ACTIVE'),
('教师', 'TEACHER', '教师角色，可以管理所授课程的成绩', FALSE, 'ACTIVE'),
('学生', 'STUDENT', '学生角色，只能查看自己的成绩', FALSE, 'ACTIVE'),
('访客', 'GUEST', '访客角色，只读权限', FALSE, 'ACTIVE');

-- ========== 7. 权限数据 (完整权限树) ==========
INSERT INTO permissions (permission_code, permission_name, resource_type, description, parent_id, is_system_permission) VALUES
-- 用户管理权限
('USER:MANAGE', '用户管理', 'MENU', '用户管理模块', NULL, TRUE),
('USER:VIEW', '查看用户', 'USER', '查看用户列表和详情', 1, TRUE),
('USER:CREATE', '创建用户', 'USER', '创建新用户', 1, TRUE),
('USER:EDIT', '编辑用户', 'USER', '编辑用户信息', 1, TRUE),
('USER:DELETE', '删除用户', 'USER', '删除用户', 1, TRUE),
('USER:RESET_PASSWORD', '重置密码', 'USER', '重置用户密码', 1, TRUE),

-- 角色管理权限
('ROLE:MANAGE', '角色管理', 'MENU', '角色管理模块', NULL, TRUE),
('ROLE:VIEW', '查看角色', 'ROLE', '查看角色列表和详情', 7, TRUE),
('ROLE:CREATE', '创建角色', 'ROLE', '创建新角色', 7, TRUE),
('ROLE:EDIT', '编辑角色', 'ROLE', '编辑角色信息', 7, TRUE),
('ROLE:DELETE', '删除角色', 'ROLE', '删除角色', 7, TRUE),
('ROLE:ASSIGN_PERMISSION', '分配权限', 'ROLE', '为角色分配权限', 7, TRUE),

-- 权限管理
('PERMISSION:MANAGE', '权限管理', 'MENU', '权限管理模块', NULL, TRUE),
('PERMISSION:VIEW', '查看权限', 'PERMISSION', '查看权限列表', 13, TRUE),

-- 学生管理权限
('STUDENT:MANAGE', '学生管理', 'MENU', '学生管理模块', NULL, FALSE),
('STUDENT:VIEW', '查看学生', 'STUDENT', '查看学生列表和详情', 15, FALSE),
('STUDENT:CREATE', '创建学生', 'STUDENT', '添加新学生', 15, FALSE),
('STUDENT:EDIT', '编辑学生', 'STUDENT', '编辑学生信息', 15, FALSE),
('STUDENT:DELETE', '删除学生', 'STUDENT', '删除学生', 15, FALSE),
('STUDENT:IMPORT', '导入学生', 'STUDENT', '批量导入学生数据', 15, FALSE),
('STUDENT:EXPORT', '导出学生', 'STUDENT', '导出学生数据', 15, FALSE),

-- 教师管理权限
('TEACHER:MANAGE', '教师管理', 'MENU', '教师管理模块', NULL, FALSE),
('TEACHER:VIEW', '查看教师', 'TEACHER', '查看教师列表和详情', 22, FALSE),
('TEACHER:CREATE', '创建教师', 'TEACHER', '添加新教师', 22, FALSE),
('TEACHER:EDIT', '编辑教师', 'TEACHER', '编辑教师信息', 22, FALSE),
('TEACHER:DELETE', '删除教师', 'TEACHER', '删除教师', 22, FALSE),

-- 课程管理权限
('COURSE:MANAGE', '课程管理', 'MENU', '课程管理模块', NULL, FALSE),
('COURSE:VIEW', '查看课程', 'COURSE', '查看课程列表和详情', 27, FALSE),
('COURSE:CREATE', '创建课程', 'COURSE', '创建新课程', 27, FALSE),
('COURSE:EDIT', '编辑课程', 'COURSE', '编辑课程信息', 27, FALSE),
('COURSE:DELETE', '删除课程', 'COURSE', '删除课程', 27, FALSE),

-- 教学班管理权限
('CLASS:MANAGE', '教学班管理', 'MENU', '教学班管理模块', NULL, FALSE),
('CLASS:VIEW', '查看教学班', 'CLASS', '查看教学班列表和详情', 32, FALSE),
('CLASS:CREATE', '创建教学班', 'CLASS', '创建新教学班', 32, FALSE),
('CLASS:EDIT', '编辑教学班', 'CLASS', '编辑教学班信息', 32, FALSE),
('CLASS:DELETE', '删除教学班', 'CLASS', '删除教学班', 32, FALSE),

-- 成绩管理权限
('GRADE:MANAGE', '成绩管理', 'MENU', '成绩管理模块', NULL, FALSE),
('GRADE:VIEW', '查看成绩', 'GRADE', '查看成绩信息', 37, FALSE),
('GRADE:VIEW_ALL', '查看所有成绩', 'GRADE', '查看所有学生成绩', 37, FALSE),
('GRADE:VIEW_SELF', '查看个人成绩', 'GRADE', '查看自己的成绩', 37, FALSE),
('GRADE:CREATE', '录入成绩', 'GRADE', '录入学生成绩', 37, FALSE),
('GRADE:EDIT', '编辑成绩', 'GRADE', '编辑成绩信息', 37, FALSE),
('GRADE:DELETE', '删除成绩', 'GRADE', '删除成绩记录', 37, FALSE),
('GRADE:IMPORT', '导入成绩', 'GRADE', '批量导入成绩', 37, FALSE),
('GRADE:EXPORT', '导出成绩', 'GRADE', '导出成绩报表', 37, FALSE),
('GRADE:STATISTICS', '成绩统计', 'GRADE', '查看成绩统计分析', 37, FALSE),

-- 系统日志权限
('LOG:MANAGE', '日志管理', 'MENU', '系统日志管理', NULL, TRUE),
('LOG:VIEW', '查看日志', 'LOG', '查看系统操作日志', 47, TRUE),
('LOG:EXPORT', '导出日志', 'LOG', '导出日志数据', 47, TRUE),

-- 系统设置权限
('SYSTEM:MANAGE', '系统设置', 'MENU', '系统设置模块', NULL, TRUE),
('SYSTEM:CONFIG', '系统配置', 'SYSTEM', '修改系统配置', 50, TRUE);

-- ========== 8. 角色权限关联 (完整授权) ==========
-- 超级管理员：所有权限
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 1, id FROM permissions;

-- 管理员：除系统配置外的所有权限
INSERT INTO role_permissions (role_id, permission_id) 
SELECT 2, id FROM permissions WHERE permission_code != 'SYSTEM:CONFIG';

-- 教务管理员：学生、教师、课程、教学班、成绩查看和管理
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 15), (3, 16), (3, 17), (3, 18), (3, 19), (3, 20), (3, 21), -- 学生管理
(3, 22), (3, 23), (3, 24), (3, 25), (3, 26), -- 教师管理
(3, 27), (3, 28), (3, 29), (3, 30), (3, 31), -- 课程管理
(3, 32), (3, 33), (3, 34), (3, 35), (3, 36), -- 教学班管理
(3, 37), (3, 38), (3, 39), (3, 44), (3, 45), (3, 46); -- 成绩管理（查看、导入导出、统计）

-- 教师：查看学生、成绩管理（自己课程）
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 15), (4, 16), -- 学生查看
(4, 22), (4, 23), -- 教师查看
(4, 27), (4, 28), -- 课程查看
(4, 32), (4, 33), -- 教学班查看
(4, 37), (4, 38), (4, 41), (4, 42), (4, 44), (4, 45), (4, 46); -- 成绩管理

-- 学生：只能查看自己的成绩
INSERT INTO role_permissions (role_id, permission_id) VALUES
(5, 37), (5, 40); -- 成绩查看（个人）

-- 访客：只读权限
INSERT INTO role_permissions (role_id, permission_id) VALUES
(6, 16), (6, 23), (6, 28), (6, 33), (6, 38); -- 各模块查看权限

-- ========== 9. 用户数据 (20个测试用户) ==========
-- 密码都是: 123456
-- 密码使用 SHA-256(salt + password) 然后 Base64 编码
-- salt123 + 123456 的 SHA-256 Base64 = mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=
INSERT INTO users (username, password_hash, salt, email, full_name, status) VALUES
-- 管理员账号
('admin', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'admin@school.edu', '系统管理员', 'ACTIVE'),
('super_admin', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'super@school.edu', '超级管理员', 'ACTIVE'),
('academic_admin', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'academic@school.edu', '教务管理员', 'ACTIVE'),

-- 教师账号 (10个)
('teacher01', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher01@school.edu', '刘教授', 'ACTIVE'),
('teacher02', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher02@school.edu', '陈老师', 'ACTIVE'),
('teacher03', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher03@school.edu', '杨老师', 'ACTIVE'),
('teacher04', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher04@school.edu', '王教授', 'ACTIVE'),
('teacher05', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher05@school.edu', '赵老师', 'ACTIVE'),
('teacher06', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher06@school.edu', '李老师', 'ACTIVE'),
('teacher07', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher07@school.edu', '周教授', 'ACTIVE'),
('teacher08', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher08@school.edu', '吴老师', 'ACTIVE'),
('teacher09', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher09@school.edu', '郑老师', 'ACTIVE'),
('teacher10', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'teacher10@school.edu', '孙教授', 'ACTIVE'),

-- 学生账号 (5个示例)
('student001', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'student001@school.edu', '学生001', 'ACTIVE'),
('student002', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'student002@school.edu', '学生002', 'ACTIVE'),
('student003', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'student003@school.edu', '学生003', 'ACTIVE'),
('student004', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'student004@school.edu', '学生004', 'ACTIVE'),
('student005', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'student005@school.edu', '学生005', 'ACTIVE'),

-- 访客账号
('guest', 'mBdo+UvvnBbIO+s5BnVqSBMy5y6V+4M4L/0g6LqMdNk=', 'salt123', 'guest@school.edu', '访客用户', 'ACTIVE');

-- ========== 10. 用户角色关联 ==========
INSERT INTO user_roles (user_id, role_id) VALUES
-- 管理员
(1, 2),  -- admin -> 管理员
(2, 1),  -- super_admin -> 超级管理员
(3, 3),  -- academic_admin -> 教务管理员

-- 教师
(4, 4), (5, 4), (6, 4), (7, 4), (8, 4),
(9, 4), (10, 4), (11, 4), (12, 4), (13, 4),

-- 学生
(14, 5), (15, 5), (16, 5), (17, 5), (18, 5),

-- 访客
(19, 6);

-- ========== 11. 系统日志数据 (模拟操作日志) ==========
INSERT INTO system_logs (user_id, username, operation_type, target_type, target_id, operation_desc, ip_address, execution_result, execution_time_ms, created_time) VALUES
-- 用户登录日志
(1, 'admin', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.100', 'SUCCESS', 120, DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 'super_admin', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.101', 'SUCCESS', 95, DATE_SUB(NOW(), INTERVAL 29 DAY)),
(4, 'teacher01', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.150', 'SUCCESS', 110, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(14, 'student001', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.200', 'SUCCESS', 105, DATE_SUB(NOW(), INTERVAL 27 DAY)),

-- 成绩录入日志
(4, 'teacher01', 'CREATE', 'GRADE', 1, '教师录入学生成绩', '192.168.1.150', 'SUCCESS', 245, DATE_SUB(NOW(), INTERVAL 26 DAY)),
(4, 'teacher01', 'CREATE', 'GRADE', 2, '教师录入学生成绩', '192.168.1.150', 'SUCCESS', 198, DATE_SUB(NOW(), INTERVAL 26 DAY)),
(5, 'teacher02', 'CREATE', 'GRADE', 3, '教师录入学生成绩', '192.168.1.151', 'SUCCESS', 210, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(5, 'teacher02', 'IMPORT', 'GRADE', NULL, '批量导入成绩数据 (50条)', '192.168.1.151', 'SUCCESS', 1850, DATE_SUB(NOW(), INTERVAL 25 DAY)),

-- 成绩修改日志
(4, 'teacher01', 'UPDATE', 'GRADE', 1, '修改学生成绩', '192.168.1.150', 'SUCCESS', 180, DATE_SUB(NOW(), INTERVAL 24 DAY)),
(4, 'teacher01', 'UPDATE', 'GRADE', 5, '修改学生成绩', '192.168.1.150', 'SUCCESS', 165, DATE_SUB(NOW(), INTERVAL 23 DAY)),

-- 学生管理日志
(3, 'academic_admin', 'CREATE', 'STUDENT', 50, '添加新学生', '192.168.1.105', 'SUCCESS', 290, DATE_SUB(NOW(), INTERVAL 22 DAY)),
(3, 'academic_admin', 'UPDATE', 'STUDENT', 50, '修改学生信息', '192.168.1.105', 'SUCCESS', 175, DATE_SUB(NOW(), INTERVAL 21 DAY)),
(3, 'academic_admin', 'IMPORT', 'STUDENT', NULL, '批量导入学生数据 (100条)', '192.168.1.105', 'SUCCESS', 3200, DATE_SUB(NOW(), INTERVAL 20 DAY)),

-- 用户管理日志
(1, 'admin', 'CREATE', 'USER', 10, '创建新用户', '192.168.1.100', 'SUCCESS', 320, DATE_SUB(NOW(), INTERVAL 19 DAY)),
(1, 'admin', 'UPDATE', 'USER', 10, '修改用户信息', '192.168.1.100', 'SUCCESS', 155, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(2, 'super_admin', 'RESET_PASSWORD', 'USER', 15, '重置用户密码', '192.168.1.101', 'SUCCESS', 210, DATE_SUB(NOW(), INTERVAL 17 DAY)),

-- 角色权限管理日志
(2, 'super_admin', 'CREATE', 'ROLE', 4, '创建新角色', '192.168.1.101', 'SUCCESS', 380, DATE_SUB(NOW(), INTERVAL 16 DAY)),
(2, 'super_admin', 'ASSIGN_PERMISSION', 'ROLE', 4, '为角色分配权限', '192.168.1.101', 'SUCCESS', 425, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(1, 'admin', 'ASSIGN_ROLE', 'USER', 18, '为用户分配角色', '192.168.1.100', 'SUCCESS', 195, DATE_SUB(NOW(), INTERVAL 14 DAY)),

-- 查询日志
(14, 'student001', 'VIEW', 'GRADE', NULL, '学生查看个人成绩', '192.168.1.200', 'SUCCESS', 85, DATE_SUB(NOW(), INTERVAL 13 DAY)),
(14, 'student001', 'EXPORT', 'GRADE', NULL, '导出个人成绩单', '192.168.1.200', 'SUCCESS', 520, DATE_SUB(NOW(), INTERVAL 12 DAY)),
(4, 'teacher01', 'VIEW', 'GRADE', NULL, '教师查看课程成绩', '192.168.1.150', 'SUCCESS', 145, DATE_SUB(NOW(), INTERVAL 11 DAY)),
(4, 'teacher01', 'STATISTICS', 'GRADE', 1, '查看成绩统计分析', '192.168.1.150', 'SUCCESS', 680, DATE_SUB(NOW(), INTERVAL 10 DAY)),

-- 失败操作日志
(19, 'guest', 'DELETE', 'GRADE', 10, '尝试删除成绩', '192.168.1.250', 'FAILED', 50, DATE_SUB(NOW(), INTERVAL 9 DAY)),
(19, 'guest', 'UPDATE', 'STUDENT', 20, '尝试修改学生信息', '192.168.1.250', 'FAILED', 45, DATE_SUB(NOW(), INTERVAL 8 DAY)),
(15, 'student002', 'VIEW', 'GRADE', NULL, '尝试查看其他学生成绩', '192.168.1.201', 'FAILED', 35, DATE_SUB(NOW(), INTERVAL 7 DAY)),

-- 近期日志
(1, 'admin', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.100', 'SUCCESS', 98, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(4, 'teacher01', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.150', 'SUCCESS', 105, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(14, 'student001', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.200', 'SUCCESS', 92, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 'academic_admin', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.105', 'SUCCESS', 115, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 'teacher02', 'IMPORT', 'GRADE', NULL, '批量导入成绩数据 (80条)', '192.168.1.151', 'SUCCESS', 2100, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'admin', 'EXPORT', 'LOG', NULL, '导出系统日志', '192.168.1.100', 'SUCCESS', 1850, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'super_admin', 'LOGIN', 'SYSTEM', NULL, '用户登录系统', '192.168.1.101', 'SUCCESS', 88, NOW()),
(4, 'teacher01', 'VIEW', 'GRADE', NULL, '查看课程成绩列表', '192.168.1.150', 'SUCCESS', 125, NOW());

-- ==================== 验证数据 ====================
SELECT '========================================' AS '';
SELECT '  数据库初始化完成！' AS message;
SELECT '========================================' AS '';
SELECT CONCAT('✓ 学生数量: ', COUNT(*)) AS info FROM student;
SELECT CONCAT('✓ 教师数量: ', COUNT(*)) AS info FROM teacher;
SELECT CONCAT('✓ 课程数量: ', COUNT(*)) AS info FROM course;
SELECT CONCAT('✓ 教学班数量: ', COUNT(*)) AS info FROM teaching_class;
SELECT CONCAT('✓ 成绩记录: ', COUNT(*)) AS info FROM grade;
SELECT CONCAT('✓ 用户数量: ', COUNT(*)) AS info FROM users;
SELECT CONCAT('✓ 角色数量: ', COUNT(*)) AS info FROM roles;
SELECT CONCAT('✓ 权限数量: ', COUNT(*)) AS info FROM permissions;
SELECT CONCAT('✓ 系统日志: ', COUNT(*)) AS info FROM system_logs;
SELECT '========================================' AS '';
SELECT '【测试账号 - 密码都是: 123456】' AS info;
SELECT '----------------------------------------' AS '';
SELECT 'super_admin   - 超级管理员' AS account;
SELECT 'admin         - 管理员' AS account;
SELECT 'academic_admin - 教务管理员' AS account;
SELECT 'teacher01     - 教师' AS account;
SELECT 'student001    - 学生' AS account;
SELECT 'guest         - 访客' AS account;
SELECT '========================================' AS '';

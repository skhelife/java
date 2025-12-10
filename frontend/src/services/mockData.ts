// 生成300名学生的Mock数据
export const generateStudents = (count = 300) => {
    const students = []
    const firstNames = ['张', '李', '王', '赵', '刘', '陈', '杨', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '林', '何', '高', '梁']
    const middleNames = ['伟', '芳', '娜', '秀', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '涛', '明', '超', '婷', '雪', '莉']
    const lastNames = ['华', '英', '玲', '霞', '红', '梅', '兰', '萍', '云', '燕', '波', '鹏', '刚', '龙', '锋', '峰', '平', '辉', '娟', '莹']

    for (let i = 1; i <= count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const middleName = middleNames[Math.floor(Math.random() * middleNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

        students.push({
            id: i,
            studentId: `2023${String(i).padStart(4, '0')}`,
            name: i <= 20 ? `学生${String(i).padStart(3, '0')}` : `${firstName}${middleName}${lastName}`,
            gender: i % 2 === 0 ? '女' : '男',
            major: ['计算机科学', '软件工程', '数据科学', '人工智能', '网络工程'][Math.floor(Math.random() * 5)],
            class: `202${Math.floor(i / 100)}班`,
            email: `student${i}@school.edu`,
            phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
            deleted: 0
        })
    }
    return students
}

// 课程数据
export const mockCourses = [
    { id: 1, courseId: 'C001', courseName: '高等数学A', credits: 5, department: '数学系' },
    { id: 2, courseId: 'C002', courseName: '大学英语', credits: 3, department: '外语系' },
    { id: 3, courseId: 'C003', courseName: 'Java程序设计', credits: 4, department: '计算机系' },
    { id: 4, courseId: 'C004', courseName: '数据结构与算法', credits: 4, department: '计算机系' },
    { id: 5, courseId: 'C005', courseName: '数据库原理', credits: 3, department: '计算机系' },
    { id: 6, courseId: 'C006', courseName: '计算机网络', credits: 4, department: '计算机系' },
    { id: 7, courseId: 'C007', courseName: '操作系统', credits: 4, department: '计算机系' },
    { id: 8, courseId: 'C008', courseName: '软件工程', credits: 3, department: '计算机系' },
    { id: 9, courseId: 'C009', courseName: '人工智能导论', credits: 3, department: '计算机系' },
    { id: 10, courseId: 'C010', courseName: 'Web前端开发', credits: 3, department: '计算机系' }
]

// 教师数据
export const mockTeachers = [
    { id: 1, teacherId: 'T001', name: '张教授', title: '教授', department: '数学系', email: 'zhang@school.edu' },
    { id: 2, teacherId: 'T002', name: '李副教授', title: '副教授', department: '外语系', email: 'li@school.edu' },
    { id: 3, teacherId: 'T003', name: '王老师', title: '讲师', department: '计算机系', email: 'wang@school.edu' },
    { id: 4, teacherId: 'T004', name: '赵教授', title: '教授', department: '计算机系', email: 'zhao@school.edu' },
    { id: 5, teacherId: 'T005', name: '刘副教授', title: '副教授', department: '计算机系', email: 'liu@school.edu' },
    { id: 6, teacherId: 'T006', name: '陈老师', title: '讲师', department: '计算机系', email: 'chen@school.edu' },
    { id: 7, teacherId: 'T007', name: '杨教授', title: '教授', department: '计算机系', email: 'yang@school.edu' },
    { id: 8, teacherId: 'T008', name: '黄副教授', title: '副教授', department: '计算机系', email: 'huang@school.edu' },
    { id: 9, teacherId: 'T009', name: '周老师', title: '讲师', department: '计算机系', email: 'zhou@school.edu' },
    { id: 10, teacherId: 'T010', name: '吴教授', title: '教授', department: '计算机系', email: 'wu@school.edu' }
]

// 教学班数据
export const mockClasses = [
    { id: 1, classId: '2023春-C001-01', semester: '2023春季', courseId: 1, teacherId: 1 },
    { id: 2, classId: '2023春-C002-01', semester: '2023春季', courseId: 2, teacherId: 2 },
    { id: 3, classId: '2023春-C003-01', semester: '2023春季', courseId: 3, teacherId: 3 },
    { id: 4, classId: '2023秋-C004-01', semester: '2023秋季', courseId: 4, teacherId: 4 },
    { id: 5, classId: '2023秋-C005-01', semester: '2023秋季', courseId: 5, teacherId: 5 }
]

// 生成成绩数据
export const generateGrades = (students: any[]) => {
    const grades: any[] = []

    let gradeId = 1
    students.forEach((student: any) => {
        const numCourses = 3 + Math.floor(Math.random() * 3)
        const selectedClasses = [...mockClasses].sort(() => 0.5 - Math.random()).slice(0, numCourses)

        selectedClasses.forEach((tc: any) => {
            const course = mockCourses.find((c: any) => c.id === tc.courseId)
            if (!course) return

            const regular = 60 + Math.random() * 40
            const midterm = 60 + Math.random() * 40
            const lab = 60 + Math.random() * 40
            const finalExam = 60 + Math.random() * 40
            const comprehensive = regular * 0.2 + midterm * 0.2 + lab * 0.2 + finalExam * 0.4

            let level = '不及格'
            if (comprehensive >= 90) level = '优秀'
            else if (comprehensive >= 80) level = '良好'
            else if (comprehensive >= 70) level = '中等'
            else if (comprehensive >= 60) level = '及格'

            grades.push({
                id: gradeId++,
                studentId: student.id,
                classId: tc.classId,
                courseName: course.courseName,
                regularScore: Math.round(regular * 10) / 10,
                midtermScore: Math.round(midterm * 10) / 10,
                labScore: Math.round(lab * 10) / 10,
                finalExamScore: Math.round(finalExam * 10) / 10,
                comprehensiveScore: Math.round(comprehensive * 10) / 10,
                level,
                createdTime: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
                student,
                teachingClass: {
                    id: tc.id,
                    classId: tc.classId,
                    semester: tc.semester,
                    courseId: tc.courseId,
                    teacherId: tc.teacherId
                },
                course
            })
        })
    })
    return grades
}

// 用户数据
export const mockUsers = [
    { id: 1, username: 'admin', fullName: '系统管理员', email: 'admin@school.edu', status: 'ACTIVE', lastLoginTime: new Date().toISOString(), roles: [{ id: 2, roleName: '管理员' }] },
    { id: 2, username: 'super_admin', fullName: '超级管理员', email: 'super@school.edu', status: 'ACTIVE', lastLoginTime: new Date(Date.now() - 3600000).toISOString(), roles: [{ id: 1, roleName: '超级管理员' }] },
    { id: 3, username: 'academic_admin', fullName: '教务管理员', email: 'academic@school.edu', status: 'ACTIVE', lastLoginTime: new Date(Date.now() - 7200000).toISOString(), roles: [{ id: 3, roleName: '教务管理员' }] }
]

// 角色数据
export const mockRoles = [
    { id: 1, roleName: '超级管理员', description: '系统最高权限', permissionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    { id: 2, roleName: '管理员', description: '系统管理权限', permissionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 3, roleName: '教务管理员', description: '教务管理权限', permissionIds: [1, 2, 3, 4, 7, 8, 9] },
    { id: 4, roleName: '教师', description: '教师权限', permissionIds: [1, 3, 7, 9] },
    { id: 5, roleName: '学生', description: '学生权限', permissionIds: [1, 9] }
]

// 权限数据
export const mockPermissions = [
    { id: 1, permissionName: '查看成绩', code: 'grade:view', category: '成绩管理' },
    { id: 2, permissionName: '录入成绩', code: 'grade:create', category: '成绩管理' },
    { id: 3, permissionName: '修改成绩', code: 'grade:update', category: '成绩管理' },
    { id: 4, permissionName: '删除成绩', code: 'grade:delete', category: '成绩管理' },
    { id: 5, permissionName: '查看学生', code: 'student:view', category: '学生管理' },
    { id: 6, permissionName: '添加学生', code: 'student:create', category: '学生管理' },
    { id: 7, permissionName: '修改学生', code: 'student:update', category: '学生管理' },
    { id: 8, permissionName: '删除学生', code: 'student:delete', category: '学生管理' },
    { id: 9, permissionName: '统计分析', code: 'stats:view', category: '统计分析' },
    { id: 10, permissionName: '用户管理', code: 'user:manage', category: '系统管理' },
    { id: 11, permissionName: '角色管理', code: 'role:manage', category: '系统管理' },
    { id: 12, permissionName: '审计日志', code: 'audit:view', category: '系统管理' }
]

// 审计日志数据
export const generateAuditLogs = () => {
    const actions = ['登录系统', '查看成绩', '录入成绩', '修改成绩', '删除成绩', '导出数据', '查看统计']
    const results = ['成功', '成功', '成功', '成功', '失败']
    const users = mockUsers.slice(0, 3)

    return Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        username: users[Math.floor(Math.random() * users.length)].username,
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: '成绩管理系统',
        result: results[Math.floor(Math.random() * results.length)],
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        details: '操作详情'
    }))
}

// 初始化所有Mock数据
export const initMockData = () => {
    const students = generateStudents(300)
    const grades = generateGrades(students)
    const logs = generateAuditLogs()

    return {
        students,
        grades,
        courses: mockCourses,
        teachers: mockTeachers,
        classes: mockClasses,
        users: mockUsers,
        roles: mockRoles,
        permissions: mockPermissions,
        logs
    }
}

// 保存Mock数据到localStorage
export const saveMockData = () => {
    const data = initMockData()
    localStorage.setItem('mockData', JSON.stringify(data))
    console.log('✅ Mock数据已保存到localStorage', data)
    return data
}

// 从localStorage获取Mock数据
export const getMockData = () => {
    const stored = localStorage.getItem('mockData')
    if (stored) {
        try {
            const data = JSON.parse(stored)
            console.log('📦 从localStorage加载数据', data)
            return data
        } catch (e) {
            console.error('❌ localStorage数据解析失败', e)
        }
    }

    console.log('🔄 localStorage无数据，初始化新数据')
    return saveMockData()
}

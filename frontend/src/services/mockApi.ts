import { getMockData } from './mockData'

// 模拟网络延迟
const delay = (ms = 200 + Math.random() * 300) => new Promise(resolve => setTimeout(resolve, ms))

// 分页辅助函数
const paginate = (array: any[], page: number, size: number) => {
    const start = (page - 1) * size
    const end = start + size
    return {
        content: array.slice(start, end),
        totalElements: array.length,
        totalPages: Math.ceil(array.length / size),
        currentPage: page,
        pageSize: size
    }
}

// Mock API实现
export const mockApi = {
    // ========== 认证功能 ==========
    login: async (username: string, password: string) => {
        await delay()
        const data = getMockData()
        const user = data.users.find((u: any) => u.username === username)

        if (!user || password !== '123456') {
            throw new Error('用户名或密码错误')
        }

        const token = `mock_token_${username}_${Date.now()}`
        localStorage.setItem('token', token)
        localStorage.setItem('currentUser', JSON.stringify(user))

        return {
            success: true,
            data: {
                token,
                user
            },
            message: '登录成功'
        }
    },

    logout: async () => {
        await delay(100)
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        return { success: true, message: '退出成功' }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('currentUser')
        return user ? JSON.parse(user) : null
    },

    // ========== 用户管理 ==========
    getUsers: async (page = 1, size = 20) => {
        await delay()
        const data = getMockData()
        return {
            success: true,
            data: paginate(data.users, page, size)
        }
    },

    createUser: async (userData: any) => {
        await delay()
        const data = getMockData()
        const newUser = {
            id: data.users.length + 1,
            ...userData,
            status: 'ACTIVE',
            lastLoginTime: new Date().toISOString(),
            roles: userData.roleIds ? userData.roleIds.map((rid: number) =>
                data.roles.find((r: any) => r.id === rid)
            ) : []
        }
        data.users.push(newUser)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: newUser,
            message: '用户创建成功'
        }
    },

    updateUser: async (id: number, userData: any) => {
        await delay()
        const data = getMockData()
        const index = data.users.findIndex((u: any) => u.id === id)

        if (index === -1) {
            throw new Error('用户不存在')
        }

        data.users[index] = { ...data.users[index], ...userData }
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: data.users[index],
            message: '用户更新成功'
        }
    },

    deleteUser: async (id: number) => {
        await delay()
        const data = getMockData()
        const index = data.users.findIndex((u: any) => u.id === id)

        if (index === -1) {
            throw new Error('用户不存在')
        }

        data.users.splice(index, 1)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            message: '用户删除成功'
        }
    },

    resetPassword: async (id: number) => {
        await delay()
        return {
            success: true,
            data: { newPassword: '123456' },
            message: '密码重置成功，新密码为: 123456'
        }
    },

    assignRoles: async (userId: number, roleIds: number[]) => {
        await delay()
        const data = getMockData()
        const user = data.users.find((u: any) => u.id === userId)

        if (!user) {
            throw new Error('用户不存在')
        }

        user.roles = roleIds.map((rid: number) =>
            data.roles.find((r: any) => r.id === rid)
        ).filter(Boolean)

        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: user,
            message: '角色分配成功'
        }
    },

    // ========== 角色管理 ==========
    getRoles: async () => {
        await delay()
        const data = getMockData()
        return {
            success: true,
            data: data.roles
        }
    },

    createRole: async (roleData: any) => {
        await delay()
        const data = getMockData()
        const newRole = {
            id: data.roles.length + 1,
            ...roleData,
            status: 'ACTIVE',
            isSystemRole: false,
            permissionCount: 0
        }
        data.roles.push(newRole)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: newRole,
            message: '角色创建成功'
        }
    },

    updateRole: async (id: number, roleData: any) => {
        await delay()
        const data = getMockData()
        const index = data.roles.findIndex((r: any) => r.id === id)

        if (index === -1) {
            throw new Error('角色不存在')
        }

        data.roles[index] = { ...data.roles[index], ...roleData }
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: data.roles[index],
            message: '角色更新成功'
        }
    },

    deleteRole: async (id: number) => {
        await delay()
        const data = getMockData()
        const role = data.roles.find((r: any) => r.id === id)

        if (!role) {
            throw new Error('角色不存在')
        }

        if (role.isSystemRole) {
            throw new Error('系统角色不能删除')
        }

        const index = data.roles.findIndex((r: any) => r.id === id)
        data.roles.splice(index, 1)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            message: '角色删除成功'
        }
    },

    assignPermissions: async (roleId: number, permissionIds: number[]) => {
        await delay()
        const data = getMockData()
        const role = data.roles.find((r: any) => r.id === roleId)

        if (!role) {
            throw new Error('角色不存在')
        }

        role.permissionCount = permissionIds.length
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            message: '权限分配成功'
        }
    },

    getRolePermissions: async (roleId: number) => {
        await delay()
        const data = getMockData()
        // 模拟返回该角色的权限
        const permissionCount = data.roles.find((r: any) => r.id === roleId)?.permissionCount || 0
        const permissions = data.permissions.slice(0, permissionCount)

        return {
            success: true,
            data: permissions
        }
    },

    // ========== 权限管理 ==========
    getPermissions: async () => {
        await delay()
        const data = getMockData()
        return {
            success: true,
            data: data.permissions
        }
    },

    // ========== 审计日志 ==========
    getLogs: async (page = 1, size = 50, filters?: any) => {
        await delay()
        const data = getMockData()
        let logs = [...data.logs]

        // 应用过滤器
        if (filters) {
            if (filters.operationType) {
                logs = logs.filter((log: any) => log.operationType === filters.operationType)
            }
            if (filters.username) {
                logs = logs.filter((log: any) => log.username.includes(filters.username))
            }
            if (filters.result) {
                logs = logs.filter((log: any) => log.executionResult === filters.result)
            }
            if (filters.startDate) {
                logs = logs.filter((log: any) => new Date(log.createdTime) >= new Date(filters.startDate))
            }
            if (filters.endDate) {
                logs = logs.filter((log: any) => new Date(log.createdTime) <= new Date(filters.endDate))
            }
        }

        return {
            success: true,
            data: paginate(logs, page, size)
        }
    },

    exportLogs: async (filters?: any) => {
        await delay()
        const data = getMockData()

        // 创建CSV内容
        const headers = ['ID', '用户名', '操作类型', '目标类型', '操作描述', 'IP地址', '执行结果', '执行时间(ms)', '创建时间']
        const rows = data.logs.map((log: any) => [
            log.id,
            log.username,
            log.operationType,
            log.targetType,
            log.operationDesc,
            log.ipAddress,
            log.executionResult,
            log.executionTimeMs,
            log.createdTime
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })

        return blob
    },

    // ========== 成绩管理 ==========
    getGrades: async (page = 1, size = 20, filters?: any) => {
        await delay()
        const data = getMockData()
        let grades = [...data.grades]

        // 应用过滤器
        if (filters) {
            if (filters.studentId) {
                grades = grades.filter((g: any) => g.student.studentId.includes(filters.studentId))
            }
            if (filters.classId) {
                grades = grades.filter((g: any) => g.classId === parseInt(filters.classId))
            }
            if (filters.minScore) {
                grades = grades.filter((g: any) => g.comprehensiveScore >= parseFloat(filters.minScore))
            }
            if (filters.maxScore) {
                grades = grades.filter((g: any) => g.comprehensiveScore <= parseFloat(filters.maxScore))
            }
        }

        return {
            success: true,
            data: paginate(grades, page, size)
        }
    },

    saveGrade: async (gradeData: any) => {
        await delay()
        const data = getMockData()

        const existingIndex = data.grades.findIndex(
            (g: any) => g.studentId === gradeData.studentId && g.classId === gradeData.classId
        )

        if (existingIndex !== -1) {
            // 更新现有成绩
            data.grades[existingIndex] = { ...data.grades[existingIndex], ...gradeData }
            localStorage.setItem('mockData', JSON.stringify(data))
            return {
                success: true,
                data: data.grades[existingIndex],
                message: '成绩更新成功'
            }
        } else {
            // 创建新成绩
            const newGrade = {
                id: data.grades.length + 1,
                ...gradeData,
                createdTime: new Date().toISOString()
            }
            data.grades.push(newGrade)
            localStorage.setItem('mockData', JSON.stringify(data))
            return {
                success: true,
                data: newGrade,
                message: '成绩录入成功'
            }
        }
    },

    deleteGrade: async (studentId: string, courseName: string) => {
        await delay()
        const data = getMockData()
        const index = data.grades.findIndex(
            (g: any) => g.student.studentId === studentId && g.courseName === courseName
        )

        if (index === -1) {
            throw new Error('成绩不存在')
        }

        data.grades.splice(index, 1)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            message: '成绩删除成功'
        }
    },

    importGrades: async (file: File) => {
        await delay(1000) // 模拟文件上传
        return {
            success: true,
            data: {
                successCount: 50,
                failCount: 0
            },
            message: '成绩导入成功，成功50条'
        }
    },

    exportGrades: async (filters?: any) => {
        await delay()
        const data = getMockData()

        const headers = ['学号', '姓名', '课程名称', '平时成绩', '期中成绩', '实验成绩', '期末成绩', '综合成绩', '等级']
        const rows = data.grades.map((g: any) => [
            g.student.studentId,
            g.student.name,
            g.courseName,
            g.regularScore,
            g.midtermScore,
            g.labScore,
            g.finalExamScore,
            g.comprehensiveScore,
            g.level
        ])

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })

        return blob
    },

    // ========== 学生管理 ==========
    getStudents: async (page = 1, size = 20) => {
        await delay()
        const data = getMockData()
        return {
            success: true,
            data: paginate(data.students, page, size)
        }
    },

    searchStudents: async (query: string) => {
        await delay()
        const data = getMockData()
        const results = data.students.filter((s: any) =>
            s.studentId.includes(query) || s.name.includes(query)
        )
        return {
            success: true,
            data: results
        }
    },

    getStudentDetail: async (id: string) => {
        await delay()
        const data = getMockData()
        const student = data.students.find((s: any) => s.studentId === id || s.id === parseInt(id))

        if (!student) {
            throw new Error('学生不存在')
        }

        return {
            success: true,
            data: student
        }
    },

    addStudent: async (studentData: any) => {
        await delay()
        const data = getMockData()
        const newStudent = {
            id: data.students.length + 1,
            ...studentData,
            deleted: 0
        }
        data.students.push(newStudent)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: newStudent,
            message: '学生添加成功'
        }
    },

    updateStudent: async (studentId: string, studentData: any) => {
        await delay()
        const data = getMockData()
        const index = data.students.findIndex((s: any) => s.studentId === studentId)

        if (index === -1) {
            throw new Error('学生不存在')
        }

        data.students[index] = { ...data.students[index], ...studentData }
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            data: data.students[index],
            message: '学生信息更新成功'
        }
    },

    deleteStudent: async (studentId: string) => {
        await delay()
        const data = getMockData()
        const index = data.students.findIndex((s: any) => s.studentId === studentId)

        if (index === -1) {
            throw new Error('学生不存在')
        }

        data.students.splice(index, 1)
        localStorage.setItem('mockData', JSON.stringify(data))

        return {
            success: true,
            message: '学生删除成功'
        }
    },

    importStudents: async (file: File) => {
        await delay(1000)
        return {
            success: true,
            data: {
                successCount: 100,
                failCount: 0
            },
            message: '学生导入成功，成功100条'
        }
    },

    // ========== 统计数据 ==========
    getStats: async () => {
        await delay()
        const data = getMockData()

        const totalStudents = data.students.length
        const totalGrades = data.grades.length
        const courseCount = data.courses.length
        const teacherCount = data.teachers.length
        const classCount = data.classes.length

        const avgScore = data.grades.reduce((sum: number, g: any) => sum + g.comprehensiveScore, 0) / data.grades.length
        const passCount = data.grades.filter((g: any) => g.comprehensiveScore >= 60).length
        const passRate = (passCount / data.grades.length) * 100
        const excellentCount = data.grades.filter((g: any) => g.comprehensiveScore >= 90).length
        const excellentRate = (excellentCount / data.grades.length) * 100
        const maxScore = Math.max(...data.grades.map((g: any) => g.comprehensiveScore))
        const minScore = Math.min(...data.grades.map((g: any) => g.comprehensiveScore))

        return {
            success: true,
            data: {
                studentCount: totalStudents,
                totalStudents: totalStudents,
                teacherCount: teacherCount,
                totalTeachers: teacherCount,
                courseCount: courseCount,
                totalCourses: courseCount,
                classCount: classCount,
                totalClasses: classCount,
                gradeCount: totalGrades,
                totalGrades: totalGrades,
                avgScore: Math.round(avgScore * 100) / 100,
                passRate: Math.round(passRate * 100) / 100,
                excellentRate: Math.round(excellentRate * 100) / 100,
                maxScore: Math.round(maxScore * 100) / 100,
                minScore: Math.round(minScore * 100) / 100,
                distribution: {
                    '优秀': data.grades.filter((g: any) => g.comprehensiveScore >= 90).length,
                    '良好': data.grades.filter((g: any) => g.comprehensiveScore >= 80 && g.comprehensiveScore < 90).length,
                    '中等': data.grades.filter((g: any) => g.comprehensiveScore >= 70 && g.comprehensiveScore < 80).length,
                    '及格': data.grades.filter((g: any) => g.comprehensiveScore >= 60 && g.comprehensiveScore < 70).length,
                    '不及格': data.grades.filter((g: any) => g.comprehensiveScore < 60).length
                }
            }
        }
    },

    getDistribution: async () => {
        await delay()
        const data = getMockData()

        const distribution = {
            '0-59': data.grades.filter((g: any) => g.comprehensiveScore < 60).length,
            '60-69': data.grades.filter((g: any) => g.comprehensiveScore >= 60 && g.comprehensiveScore < 70).length,
            '70-79': data.grades.filter((g: any) => g.comprehensiveScore >= 70 && g.comprehensiveScore < 80).length,
            '80-89': data.grades.filter((g: any) => g.comprehensiveScore >= 80 && g.comprehensiveScore < 90).length,
            '90-100': data.grades.filter((g: any) => g.comprehensiveScore >= 90).length,
            // 保留旧格式以兼容其他可能的使用
            excellent: data.grades.filter((g: any) => g.comprehensiveScore >= 90).length,
            good: data.grades.filter((g: any) => g.comprehensiveScore >= 80 && g.comprehensiveScore < 90).length,
            medium: data.grades.filter((g: any) => g.comprehensiveScore >= 70 && g.comprehensiveScore < 80).length,
            pass: data.grades.filter((g: any) => g.comprehensiveScore >= 60 && g.comprehensiveScore < 70).length,
            fail: data.grades.filter((g: any) => g.comprehensiveScore < 60).length
        }

        return {
            success: true,
            data: distribution
        }
    },

    getRankings: async (top = 100) => {
        await delay()
        const data = getMockData()

        // 按学生分组计算平均分
        const studentAvgs = new Map()
        data.grades.forEach((g: any) => {
            if (!studentAvgs.has(g.studentId)) {
                studentAvgs.set(g.studentId, {
                    student: g.student,
                    scores: [],
                    avgScore: 0
                })
            }
            studentAvgs.get(g.studentId).scores.push(g.comprehensiveScore)
        })

        const rankings = Array.from(studentAvgs.values()).map((item: any) => {
            item.avgScore = item.scores.reduce((a: number, b: number) => a + b, 0) / item.scores.length
            return item
        }).sort((a, b) => b.avgScore - a.avgScore).slice(0, top)

        return {
            success: true,
            data: rankings
        }
    },

    getClasses: async () => {
        await delay()
        const data = getMockData()

        console.log('📚 getClasses 被调用')
        console.log('- classes数量:', data.classes.length)
        console.log('- grades总数:', data.grades.length)

        // 返回包含完整信息的班级列表
        const classesWithDetails = data.classes.map((cls: any) => {
            const course = data.courses.find((c: any) => c.id === cls.courseId)
            const teacher = data.teachers.find((t: any) => t.id === cls.teacherId)

            console.log(`\n检查班级: ${cls.classId}`)
            console.log('- 班级classId类型:', typeof cls.classId, '值:', cls.classId)

            // 详细检查成绩过滤
            const classGrades = data.grades.filter((g: any) => {
                const match = g.classId === cls.classId
                if (!match && data.grades.indexOf(g) < 5) {
                    console.log('  成绩不匹配:', {
                        gradeClassId: g.classId,
                        gradeClassIdType: typeof g.classId,
                        clsClassId: cls.classId,
                        clsClassIdType: typeof cls.classId,
                        strictEqual: g.classId === cls.classId,
                        looseEqual: g.classId == cls.classId
                    })
                }
                return match
            })

            console.log(`- 找到 ${classGrades.length} 个成绩`)

            return {
                id: cls.id,
                classId: cls.classId,
                semester: cls.semester,
                courseId: cls.courseId,
                teacherId: cls.teacherId,
                course: course ? {
                    id: course.id,
                    courseId: course.courseId,
                    courseName: course.courseName,
                    credits: course.credits
                } : null,
                teacher: teacher ? {
                    id: teacher.id,
                    teacherId: teacher.teacherId,
                    name: teacher.name,
                    title: teacher.title
                } : null,
                courseName: course?.courseName || '未知课程',
                teacherName: teacher?.name || '未知教师',
                studentCount: classGrades.length,
                avgScore: classGrades.length > 0
                    ? Math.round((classGrades.reduce((sum: number, g: any) => sum + g.comprehensiveScore, 0) / classGrades.length) * 100) / 100
                    : 0
            }
        })

        console.log('\n✅ getClasses 完成，返回', classesWithDetails.length, '个班级')
        classesWithDetails.forEach((c: any) => {
            console.log(`  ${c.classId}: ${c.studentCount}人`)
        })

        return {
            success: true,
            data: classesWithDetails
        }
    },

    getClassDetail: async (classId: string) => {
        await delay()
        const data = getMockData()

        console.log('🔍 getClassDetail 调试:', classId)
        console.log('- 总成绩数:', data.grades.length)
        console.log('- 查找的classId:', classId, '类型:', typeof classId)

        // 找到班级信息
        const classInfo = data.classes.find((c: any) => c.classId === classId)
        if (!classInfo) {
            console.error('❌ 班级不存在:', classId)
            throw new Error('班级不存在')
        }
        console.log('✓ 找到班级:', classInfo)

        // 找到该班级的所有成绩
        const grades = data.grades.filter((g: any) => g.classId === classId)
        console.log('- 筛选结果: 该班级有', grades.length, '个成绩')

        // 调试：检查前3条成绩的classId
        console.log('- 前3条相关成绩的classId:')
        const relatedGrades = data.grades.slice(0, 10).map((g: any) => ({
            studentId: g.student?.studentId,
            classId: g.classId,
            classIdType: typeof g.classId,
            match: g.classId === classId,
            strictMatch: g.classId === classId
        }))
        console.table(relatedGrades)

        // 找到课程和教师信息
        const course = data.courses.find((c: any) => c.id === classInfo.courseId)
        const teacher = data.teachers.find((t: any) => t.id === classInfo.teacherId)

        // 计算成绩分布
        const distribution = {
            '优秀': grades.filter((g: any) => g.comprehensiveScore >= 90).length,
            '良好': grades.filter((g: any) => g.comprehensiveScore >= 80 && g.comprehensiveScore < 90).length,
            '中等': grades.filter((g: any) => g.comprehensiveScore >= 70 && g.comprehensiveScore < 80).length,
            '及格': grades.filter((g: any) => g.comprehensiveScore >= 60 && g.comprehensiveScore < 70).length,
            '不及格': grades.filter((g: any) => g.comprehensiveScore < 60).length
        }
        console.log('- 成绩分布:', distribution)

        return {
            success: true,
            data: {
                id: classInfo.id,
                classId: classInfo.classId,
                semester: classInfo.semester,
                course: {
                    id: course?.id,
                    courseId: course?.courseId,
                    courseName: course?.courseName || '未知课程',
                    credits: course?.credits
                },
                teacher: {
                    id: teacher?.id,
                    teacherId: teacher?.teacherId,
                    name: teacher?.name || '未知教师',
                    title: teacher?.title
                },
                courseName: course?.courseName || '未知课程',
                teacherName: teacher?.name || '未知教师',
                studentCount: grades.length,
                avgScore: grades.length > 0
                    ? Math.round((grades.reduce((sum: number, g: any) => sum + g.comprehensiveScore, 0) / grades.length) * 100) / 100
                    : 0,
                distribution,
                grades: grades.map((g: any) => ({
                    ...g,
                    studentName: g.student?.name || '未知学生',
                    studentId: g.student?.studentId || ''
                }))
            }
        }
    },

    getCourses: async () => {
        await delay()
        return {
            success: true,
            data: [
                { id: 1, name: '高等数学A', credits: 5 },
                { id: 2, name: '大学英语', credits: 3 },
                { id: 3, name: 'Java程序设计', credits: 4 },
                { id: 4, name: '数据结构与算法', credits: 4 },
                { id: 5, name: '数据库原理', credits: 3 },
                { id: 6, name: '计算机网络', credits: 4 },
                { id: 7, name: '操作系统', credits: 4 },
                { id: 8, name: '软件工程', credits: 3 },
                { id: 9, name: '人工智能导论', credits: 3 },
                { id: 10, name: 'Web前端开发', credits: 3 }
            ]
        }
    }
}

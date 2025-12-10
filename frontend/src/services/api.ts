// 使用Mock API代替真实后端
import { mockApi } from './mockApi'

export const api = mockApi

/* 原始API实现已被Mock API替代,如需使用真实后端,请注释上面两行并取消下面代码的注释

const API_BASE = 'http://localhost:4000/api'

const getToken = () => localStorage.getItem('token')

const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
})

export const api_real = {
    // ========== 认证功能 ==========

    // 用户登录
    login: async (username: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await res.json()
        if (data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
        }
        return data
    },

    // 用户登出
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    // 获取当前用户
    getCurrentUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },

    // ========== 查询功能 ==========

    // 获取所有教学班
    getClasses: async () => {
        const res = await fetch(`${API_BASE}/classes`, {
            headers: authHeaders()
        })
        return res.json()
    },

    // 获取教学班详情
    getClassDetail: async (classId: string) => {
        const res = await fetch(`${API_BASE}/classes/${classId}`)
        return res.json()
    },

    // 搜索学生
    searchStudents: async (query: string) => {
        const res = await fetch(`${API_BASE}/students/search?q=${encodeURIComponent(query)}`)
        return res.json()
    },

    // 获取学生详情
    getStudentDetail: async (id: string) => {
        const res = await fetch(`${API_BASE}/students/${id}`)
        return res.json()
    },

    // 获取排行榜
    getRankings: async (top = 100) => {
        const res = await fetch(`${API_BASE}/rankings?top=${top}`)
        return res.json()
    },

    // 获取成绩分布
    getDistribution: async () => {
        const res = await fetch(`${API_BASE}/stats/distribution`)
        return res.json()
    },

    // 获取系统统计
    getStats: async () => {
        const res = await fetch(`${API_BASE}/stats`)
        return res.json()
    },

    // 获取所有课程
    getCourses: async () => {
        const res = await fetch(`${API_BASE}/courses`)
        return res.json()
    },

    // ========== 管理功能 ==========

    // 添加学生
    addStudent: async (studentId: string, name: string, gender: string) => {
        const res = await fetch(`${API_BASE}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, name, gender })
        })
        return res.json()
    },

    // 更新学生信息
    updateStudent: async (studentId: string, name: string, gender: string) => {
        const res = await fetch(`${API_BASE}/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, gender })
        })
        return res.json()
    },

    // 删除学生
    deleteStudent: async (studentId: string) => {
        const res = await fetch(`${API_BASE}/students/${studentId}`, {
            method: 'DELETE'
        })
        return res.json()
    },

    // 录入/更新成绩
    saveGrade: async (grade: any) => {
        const res = await fetch(`${API_BASE}/grades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(grade)
        })
        return res.json()
    },

    // 删除成绩
    deleteGrade: async (studentId: string, courseName: string) => {
        const res = await fetch(`${API_BASE}/grades/${studentId}/${encodeURIComponent(courseName)}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        return res.json()
    },

    // ========== 用户管理 ==========

    // 获取用户列表（分页）
    getUsers: async (page = 1, size = 20) => {
        const res = await fetch(`${API_BASE}/users?page=${page}&size=${size}`, {
            headers: authHeaders()
        })
        return res.json()
    },

    // 创建用户
    createUser: async (userData: any) => {
        const res = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(userData)
        })
        return res.json()
    },

    // 更新用户
    updateUser: async (id: number, userData: any) => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(userData)
        })
        return res.json()
    },

    // 删除用户
    deleteUser: async (id: number) => {
        const res = await fetch(`${API_BASE}/users/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        return res.json()
    },

    // 重置用户密码
    resetPassword: async (id: number) => {
        const res = await fetch(`${API_BASE}/users/${id}/reset-password`, {
            method: 'POST',
            headers: authHeaders()
        })
        return res.json()
    },

    // 为用户分配角色
    assignRoles: async (userId: number, roleIds: number[]) => {
        const res = await fetch(`${API_BASE}/users/${userId}/roles`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ roleIds })
        })
        return res.json()
    },

    // ========== 角色管理 ==========

    // 获取所有角色
    getRoles: async () => {
        const res = await fetch(`${API_BASE}/roles`, {
            headers: authHeaders()
        })
        return res.json()
    },

    // 创建角色
    createRole: async (roleData: any) => {
        const res = await fetch(`${API_BASE}/roles`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(roleData)
        })
        return res.json()
    },

    // 更新角色
    updateRole: async (id: number, roleData: any) => {
        const res = await fetch(`${API_BASE}/roles/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(roleData)
        })
        return res.json()
    },

    // 删除角色
    deleteRole: async (id: number) => {
        const res = await fetch(`${API_BASE}/roles/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        return res.json()
    },

    // 为角色分配权限
    assignPermissions: async (roleId: number, permissionIds: number[]) => {
        const res = await fetch(`${API_BASE}/roles/${roleId}/permissions`, {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify({ permissionIds })
        })
        return res.json()
    },

    // 获取角色的权限列表
    getRolePermissions: async (roleId: number) => {
        const res = await fetch(`${API_BASE}/roles/${roleId}/permissions`, {
            headers: authHeaders()
        })
        return res.json()
    },

    // ========== 权限管理 ==========

    // 获取所有权限
    getPermissions: async () => {
        const res = await fetch(`${API_BASE}/permissions`, {
            headers: authHeaders()
        })
        return res.json()
    },

    // ========== 审计日志 ==========

    // 获取系统日志（分页）
    getLogs: async (page = 1, size = 50, filters?: any) => {
        let url = `${API_BASE}/logs?page=${page}&size=${size}`
        if (filters) {
            if (filters.operationType) url += `&operationType=${filters.operationType}`
            if (filters.username) url += `&username=${filters.username}`
            if (filters.result) url += `&result=${filters.result}`
            if (filters.startDate) url += `&startDate=${filters.startDate}`
            if (filters.endDate) url += `&endDate=${filters.endDate}`
        }
        const res = await fetch(url, {
            headers: authHeaders()
        })
        return res.json()
    },

    // 导出日志
    exportLogs: async (filters?: any) => {
        let url = `${API_BASE}/logs/export?format=csv`
        if (filters) {
            if (filters.startDate) url += `&startDate=${filters.startDate}`
            if (filters.endDate) url += `&endDate=${filters.endDate}`
        }
        const res = await fetch(url, {
            headers: authHeaders()
        })
        return res.blob()
    },

    // ========== 成绩管理（增强） ==========

    // 获取成绩列表（分页）
    getGrades: async (page = 1, size = 20, filters?: any) => {
        let url = `${API_BASE}/grades?page=${page}&size=${size}`
        if (filters) {
            if (filters.studentId) url += `&studentId=${filters.studentId}`
            if (filters.classId) url += `&classId=${filters.classId}`
            if (filters.minScore) url += `&minScore=${filters.minScore}`
            if (filters.maxScore) url += `&maxScore=${filters.maxScore}`
        }
        const res = await fetch(url, {
            headers: authHeaders()
        })
        return res.json()
    },

    // 批量导入成绩
    importGrades: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch(`${API_BASE}/grades/import`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        })
        return res.json()
    },

    // 导出成绩
    exportGrades: async (filters?: any) => {
        let url = `${API_BASE}/grades/export?format=excel`
        if (filters) {
            if (filters.classId) url += `&classId=${filters.classId}`
        }
        const res = await fetch(url, {
            headers: authHeaders()
        })
        return res.blob()
    },

    // ========== 学生管理（增强） ==========

    // 获取学生列表（分页）
    getStudents: async (page = 1, size = 20) => {
        const res = await fetch(`${API_BASE}/students?page=${page}&size=${size}`, {
            headers: authHeaders()
        })
        return res.json()
    },

    // 批量导入学生
    importStudents: async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch(`${API_BASE}/students/import`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        })
        return res.json()
    }
}

*/

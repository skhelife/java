import { saveMockData, getMockData } from './mockData'

// 初始化Mock数据到localStorage
export const initializeMockData = () => {
    console.log('🔄 正在初始化Mock数据...')

    // 使用getMockData，它会自动检查localStorage并在需要时初始化
    const data = getMockData()

    console.log('✅ Mock数据初始化完成!')
    console.log(`📊 学生数量: ${data.students.length}`)
    console.log(`📝 成绩记录: ${data.grades.length}`)
    console.log(`📚 课程数量: ${data.courses?.length || 0}`)
    console.log(`👨‍🏫 教师数量: ${data.teachers?.length || 0}`)
    console.log(`🏫 教学班数: ${data.classes?.length || 0}`)
    console.log(`👥 用户数量: ${data.users.length}`)
    console.log(`🔐 角色数量: ${data.roles.length}`)
    console.log(`🔑 权限数量: ${data.permissions.length}`)
    console.log(`📋 日志数量: ${data.logs.length}`)

    return data
}

// 清除Mock数据
export const clearMockData = () => {
    localStorage.removeItem('mockData')
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    console.log('🗑️ Mock数据已清除')
}

// 重新加载Mock数据
export const reloadMockData = () => {
    clearMockData()
    return initializeMockData()
}

// 导出数据验证函数
export const validateMockData = () => {
    const data = getMockData()

    const validation = {
        students: data.students?.length > 0,
        grades: data.grades?.length > 0,
        courses: data.courses?.length > 0,
        teachers: data.teachers?.length > 0,
        classes: data.classes?.length > 0,
        users: data.users?.length > 0,
        roles: data.roles?.length > 0,
        permissions: data.permissions?.length > 0,
        logs: data.logs?.length > 0
    }

    const allValid = Object.values(validation).every(v => v)

    if (allValid) {
        console.log('✅ Mock数据验证通过', {
            students: data.students.length,
            grades: data.grades.length,
            courses: data.courses.length,
            teachers: data.teachers.length,
            classes: data.classes.length,
            users: data.users.length,
            roles: data.roles.length,
            permissions: data.permissions.length,
            logs: data.logs.length
        })
    } else {
        console.error('❌ Mock数据验证失败:', validation)
    }

    return { valid: allValid, details: validation, data }
}

// 在控制台暴露工具函数
if (typeof window !== 'undefined') {
    (window as any).mockDataTools = {
        init: initializeMockData,
        clear: clearMockData,
        reload: reloadMockData,
        validate: validateMockData,
        getData: getMockData
    }
    console.log('🛠️ Mock数据工具已加载到 window.mockDataTools')
}

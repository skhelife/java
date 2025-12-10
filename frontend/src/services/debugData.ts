// 数据调试工具
import { getMockData } from './mockData'

export const debugMockData = () => {
    console.log('🔍 开始数据调试...')

    const data = getMockData()

    console.log('📊 数据概览:')
    console.log('- 学生总数:', data.students.length)
    console.log('- 课程总数:', data.courses.length)
    console.log('- 教师总数:', data.teachers.length)
    console.log('- 教学班数:', data.classes.length)
    console.log('- 成绩总数:', data.grades.length)

    console.log('\n📚 教学班详情:')
    data.classes.forEach((cls: any) => {
        console.log(`班级: ${cls.classId}`)
        console.log(`  - 课程ID: ${cls.courseId}`)
        console.log(`  - 教师ID: ${cls.teacherId}`)
    })

    console.log('\n🎯 成绩数据classId分布:')
    const classIdMap = new Map()
    data.grades.forEach((g: any) => {
        const count = classIdMap.get(g.classId) || 0
        classIdMap.set(g.classId, count + 1)
    })

    classIdMap.forEach((count: number, classId: string) => {
        console.log(`${classId}: ${count}人`)
    })

    console.log('\n⚠️ 问题检查:')

    // 检查1: classId类型
    const firstGrade = data.grades[0]
    console.log('第一条成绩的classId类型:', typeof firstGrade.classId, '值:', firstGrade.classId)

    const firstClass = data.classes[0]
    console.log('第一个班级的classId类型:', typeof firstClass.classId, '值:', firstClass.classId)

    // 检查2: 是否所有成绩的classId都在classes中
    const validClassIds = new Set(data.classes.map((c: any) => c.classId))
    const invalidGrades = data.grades.filter((g: any) => !validClassIds.has(g.classId))

    if (invalidGrades.length > 0) {
        console.error('❌ 发现无效的classId成绩数量:', invalidGrades.length)
        console.log('无效classId示例:', invalidGrades.slice(0, 3).map((g: any) => ({
            studentId: g.student?.studentId,
            classId: g.classId,
            classIdType: typeof g.classId
        })))
    } else {
        console.log('✅ 所有成绩的classId都有效')
    }

    // 检查3: 每个班级的学生数
    console.log('\n👥 各班级学生统计:')
    data.classes.forEach((cls: any) => {
        const students = data.grades.filter((g: any) => g.classId === cls.classId)
        const course = data.courses.find((c: any) => c.id === cls.courseId)
        console.log(`${cls.classId} (${course?.courseName}): ${students.length}人`)

        if (students.length === 0) {
            console.warn(`  ⚠️ 该班级没有学生！`)

            // 检查是否有成绩但classId不匹配
            const possibleMatches = data.grades.filter((g: any) =>
                String(g.classId) === String(cls.classId) ||
                g.classId == cls.classId
            )
            console.log(`  尝试宽松匹配: ${possibleMatches.length}人`)
        }
    })

    return data
}

// 暴露到全局
if (typeof window !== 'undefined') {
    (window as any).debugMockData = debugMockData
}

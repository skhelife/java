const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

// 模拟 Java 后端数据结构
const courses = [
    { courseId: 'C001', courseName: 'Java程序设计' },
    { courseId: 'C002', courseName: '数据结构与算法' },
    { courseId: 'C003', courseName: '计算机网络' },
    { courseId: 'C004', courseName: '数据库原理' },
    { courseId: 'C005', courseName: '操作系统' }
]

const teachers = [
    { teacherId: 'T001', name: '王教授' },
    { teacherId: 'T002', name: '李教授' },
    { teacherId: 'T003', name: '张副教授' },
    { teacherId: 'T004', name: '刘讲师' },
    { teacherId: 'T005', name: '陈教授' }
]

// 生成300个学生
const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗']
const secondNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞']
const genders = ['男', '女']
const students = []
const usedNames = new Set()

for (let i = 1; i <= 300; i++) {
    let name
    do {
        name = firstNames[Math.floor(Math.random() * firstNames.length)] +
            secondNames[Math.floor(Math.random() * secondNames.length)]
    } while (usedNames.has(name))
    usedNames.add(name)

    students.push({
        studentId: `2024${String(i).padStart(4, '0')}`,
        name,
        gender: genders[Math.floor(Math.random() * genders.length)]
    })
}

// 生成教学班
const teachingClasses = []
let classCounter = 1
courses.forEach((course, idx) => {
    for (let i = 0; i < 2; i++) {
        const classId = `TC${String(classCounter++).padStart(3, '0')}`
        const studentsInClass = students.slice(i * 30, (i + 1) * 30)
        teachingClasses.push({
            classId,
            course,
            teacher: teachers[idx % teachers.length],
            students: studentsInClass.map(s => s.studentId),
            studentCount: studentsInClass.length
        })
    }
})

// 生成成绩
const grades = []
students.forEach(student => {
    courses.forEach(course => {
        const regularScore = 60 + Math.floor(Math.random() * 40)
        const midtermScore = 60 + Math.floor(Math.random() * 40)
        const labScore = 60 + Math.floor(Math.random() * 40)
        const finalExamScore = 60 + Math.floor(Math.random() * 40)
        const comprehensiveScore = (regularScore * 0.2 + midtermScore * 0.2 + labScore * 0.3 + finalExamScore * 0.3).toFixed(2)

        grades.push({
            studentId: student.studentId,
            courseName: course.courseName,
            regularScore,
            midtermScore,
            labScore,
            finalExamScore,
            comprehensiveScore: parseFloat(comprehensiveScore)
        })
    })
})

// 计算学生统计
const studentStats = students.map(student => {
    const studentGrades = grades.filter(g => g.studentId === student.studentId)
    const avgScore = (studentGrades.reduce((sum, g) => sum + g.comprehensiveScore, 0) / studentGrades.length).toFixed(2)
    const maxScore = Math.max(...studentGrades.map(g => g.comprehensiveScore))
    const minScore = Math.min(...studentGrades.map(g => g.comprehensiveScore))

    const badges = []
    if (maxScore >= 95) badges.push('满分达人')
    if (avgScore >= 85) badges.push('学霸')
    if (maxScore - minScore < 10) badges.push('稳定王者')
    if (Math.random() > 0.8) badges.push('进步之星')

    return {
        ...student,
        avgScore: parseFloat(avgScore),
        maxScore,
        minScore,
        badges,
        grades: studentGrades
    }
})

studentStats.sort((a, b) => b.avgScore - a.avgScore)
studentStats.forEach((s, idx) => s.rank = idx + 1)

// API 路由
app.get('/api/classes', (req, res) => {
    res.json(teachingClasses.map(tc => ({
        classId: tc.classId,
        courseName: tc.course.courseName,
        teacherName: tc.teacher.name,
        studentCount: tc.studentCount
    })))
})

app.get('/api/classes/:classId', (req, res) => {
    const tc = teachingClasses.find(c => c.classId === req.params.classId)
    if (!tc) return res.status(404).json({ message: 'Class not found' })

    const studentsInClass = tc.students.map(sid => {
        const student = students.find(s => s.studentId === sid)
        const studentGrade = grades.find(g => g.studentId === sid && g.courseName === tc.course.courseName)
        return { ...student, ...studentGrade }
    })

    const distribution = { '0-59': 0, '60-69': 0, '70-79': 0, '80-89': 0, '90-100': 0 }
    studentsInClass.forEach(s => {
        const score = s.comprehensiveScore
        if (score < 60) distribution['0-59']++
        else if (score < 70) distribution['60-69']++
        else if (score < 80) distribution['70-79']++
        else if (score < 90) distribution['80-89']++
        else distribution['90-100']++
    })

    res.json({ ...tc, students: studentsInClass, distribution })
})

app.get('/api/students/search', (req, res) => {
    const query = (req.query.q || '').toLowerCase()
    if (!query) return res.json([])

    const results = studentStats.filter(s =>
        s.studentId.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query)
    ).slice(0, 10)

    res.json(results.map(s => ({
        studentId: s.studentId,
        name: s.name,
        gender: s.gender,
        avgScore: s.avgScore
    })))
})

app.get('/api/students/:id', (req, res) => {
    const student = studentStats.find(s =>
        s.studentId === req.params.id || s.name === req.params.id
    )
    if (!student) return res.status(404).json({ message: 'Student not found' })
    res.json(student)
})

app.get('/api/rankings', (req, res) => {
    const top = parseInt(req.query.top) || 100
    res.json(studentStats.slice(0, top).map(s => ({
        rank: s.rank,
        studentId: s.studentId,
        name: s.name,
        avgScore: s.avgScore,
        badges: s.badges
    })))
})

app.get('/api/stats/distribution', (req, res) => {
    const distribution = { '0-59': 0, '60-69': 0, '70-79': 0, '80-89': 0, '90-100': 0 }
    grades.forEach(g => {
        const score = g.comprehensiveScore
        if (score < 60) distribution['0-59']++
        else if (score < 70) distribution['60-69']++
        else if (score < 80) distribution['70-79']++
        else if (score < 90) distribution['80-89']++
        else distribution['90-100']++
    })
    res.json(distribution)
})

app.get('/api/stats', (req, res) => {
    const totalStudents = students.length
    const totalCourses = courses.length
    const totalTeachers = teachers.length
    const avgScore = (studentStats.reduce((sum, s) => sum + s.avgScore, 0) / totalStudents).toFixed(2)
    const excellentRate = ((studentStats.filter(s => s.avgScore >= 85).length / totalStudents) * 100).toFixed(1)
    const passRate = ((studentStats.filter(s => s.avgScore >= 60).length / totalStudents) * 100).toFixed(1)

    res.json({
        totalStudents,
        totalCourses,
        totalTeachers,
        totalClasses: teachingClasses.length,
        avgScore: parseFloat(avgScore),
        excellentRate: parseFloat(excellentRate),
        passRate: parseFloat(passRate),
        totalGrades: grades.length
    })
})

// ==================== 管理功能 API ====================

// 添加学生
app.post('/api/students', (req, res) => {
    const { studentId, name, gender } = req.body
    if (!studentId || !name || !gender) {
        return res.status(400).json({ message: '缺少必要参数' })
    }
    if (students.find(s => s.studentId === studentId)) {
        return res.status(409).json({ message: '学号已存在' })
    }
    const newStudent = { studentId, name, gender }
    students.push(newStudent)
    // 为新学生生成成绩
    courses.forEach(course => {
        const regularScore = 60 + Math.floor(Math.random() * 40)
        const midtermScore = 60 + Math.floor(Math.random() * 40)
        const labScore = 60 + Math.floor(Math.random() * 40)
        const finalExamScore = 60 + Math.floor(Math.random() * 40)
        const comprehensiveScore = (regularScore * 0.2 + midtermScore * 0.2 + labScore * 0.3 + finalExamScore * 0.3).toFixed(2)
        grades.push({
            studentId,
            courseName: course.courseName,
            regularScore,
            midtermScore,
            labScore,
            finalExamScore,
            comprehensiveScore: parseFloat(comprehensiveScore)
        })
    })
    res.status(201).json({ message: '学生添加成功', student: newStudent })
})

// 删除学生
app.delete('/api/students/:id', (req, res) => {
    const idx = students.findIndex(s => s.studentId === req.params.id)
    if (idx === -1) return res.status(404).json({ message: '学生不存在' })
    students.splice(idx, 1)
    // 删除相关成绩
    const gradeIdx = grades.findIndex(g => g.studentId === req.params.id)
    if (gradeIdx !== -1) grades.splice(gradeIdx, grades.length)
    res.json({ message: '学生删除成功' })
})

// 更新学生信息
app.put('/api/students/:id', (req, res) => {
    const student = students.find(s => s.studentId === req.params.id)
    if (!student) return res.status(404).json({ message: '学生不存在' })
    const { name, gender } = req.body
    if (name) student.name = name
    if (gender) student.gender = gender
    res.json({ message: '学生信息更新成功', student })
})

// 录入/更新成绩
app.post('/api/grades', (req, res) => {
    const { studentId, courseName, regularScore, midtermScore, labScore, finalExamScore } = req.body
    if (!studentId || !courseName) {
        return res.status(400).json({ message: '缺少必要参数' })
    }

    const comprehensiveScore = (regularScore * 0.2 + midtermScore * 0.2 + labScore * 0.3 + finalExamScore * 0.3).toFixed(2)

    const existingGrade = grades.find(g => g.studentId === studentId && g.courseName === courseName)
    if (existingGrade) {
        // 更新现有成绩
        existingGrade.regularScore = regularScore
        existingGrade.midtermScore = midtermScore
        existingGrade.labScore = labScore
        existingGrade.finalExamScore = finalExamScore
        existingGrade.comprehensiveScore = parseFloat(comprehensiveScore)
        res.json({ message: '成绩更新成功', grade: existingGrade })
    } else {
        // 添加新成绩
        const newGrade = {
            studentId,
            courseName,
            regularScore,
            midtermScore,
            labScore,
            finalExamScore,
            comprehensiveScore: parseFloat(comprehensiveScore)
        }
        grades.push(newGrade)
        res.status(201).json({ message: '成绩录入成功', grade: newGrade })
    }
})

// 删除成绩
app.delete('/api/grades/:studentId/:courseName', (req, res) => {
    const idx = grades.findIndex(g =>
        g.studentId === req.params.studentId &&
        g.courseName === decodeURIComponent(req.params.courseName)
    )
    if (idx === -1) return res.status(404).json({ message: '成绩不存在' })
    grades.splice(idx, 1)
    res.json({ message: '成绩删除成功' })
})

// 获取所有课程
app.get('/api/courses', (req, res) => {
    res.json(courses)
})

const port = 4000
app.listen(port, () => console.log(`✨ Mock API server running on http://localhost:${port}`))

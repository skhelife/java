import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function GradeEntry() {
    const [students, setStudents] = useState<any[]>([])
    const [courses, setCourses] = useState<any[]>([])
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [gradeForm, setGradeForm] = useState({
        courseName: '',
        regularScore: 80,
        midtermScore: 80,
        labScore: 80,
        finalExamScore: 80
    })

    useEffect(() => {
        api.getCourses().then(res => setCourses(res.data || []))
    }, [])

    const handleSearchStudent = async (query: string) => {
        if (query.length < 2) return
        const results = await api.searchStudents(query)
        setStudents(results.data || [])
    }

    const handleSelectStudent = async (studentId: string) => {
        const detail = await api.getStudentDetail(studentId)
        setSelectedStudent(detail.data)
        setStudents([])
    }

    const handleSubmitGrade = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedStudent) {
            alert('请先选择学生')
            return
        }
        try {
            await api.saveGrade({
                studentId: selectedStudent.studentId,
                ...gradeForm
            })
            alert('成绩录入成功！')
            // 重新加载学生数据
            const updated = await api.getStudentDetail(selectedStudent.studentId)
            setSelectedStudent(updated)
            setGradeForm({
                courseName: '',
                regularScore: 80,
                midtermScore: 80,
                labScore: 80,
                finalExamScore: 80
            })
        } catch (error) {
            alert('录入失败：' + error)
        }
    }

    const handleDeleteGrade = async (courseName: string) => {
        if (!selectedStudent) return
        if (!confirm(`确定要删除 ${courseName} 的成绩吗？`)) return
        try {
            await api.deleteGrade(selectedStudent.studentId, courseName)
            alert('成绩删除成功！')
            const updated = await api.getStudentDetail(selectedStudent.studentId)
            setSelectedStudent(updated)
        } catch (error) {
            alert('删除失败：' + error)
        }
    }

    const handleEditGrade = (grade: any) => {
        setGradeForm({
            courseName: grade.courseName,
            regularScore: grade.regularScore,
            midtermScore: grade.midtermScore,
            labScore: grade.labScore,
            finalExamScore: grade.finalExamScore
        })
    }

    return (
        <div className="page">
            <div className="glass-panel">
                <h2>📝 成绩录入与管理</h2>

                <div style={{ marginTop: 24 }}>
                    <h3>1️⃣ 选择学生</h3>
                    <input
                        type="text"
                        placeholder="输入学号或姓名搜索..."
                        onChange={e => handleSearchStudent(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            marginTop: 12,
                            borderRadius: 8,
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff'
                        }}
                    />
                    {students.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                            {students.map(s => (
                                <div
                                    key={s.studentId}
                                    onClick={() => handleSelectStudent(s.studentId)}
                                    style={{
                                        padding: 12,
                                        marginBottom: 8,
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: 8,
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    {s.name} ({s.studentId}) - 平均分：{s.avgScore}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedStudent && (
                    <>
                        <div style={{
                            marginTop: 24,
                            padding: 16,
                            background: 'rgba(110,231,183,0.1)',
                            borderRadius: 12,
                            border: '1px solid rgba(110,231,183,0.3)'
                        }}>
                            <strong>已选择：</strong> {selectedStudent.name} ({selectedStudent.studentId}) | 性别：{selectedStudent.gender} | 平均分：{selectedStudent.avgScore}
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <h3>2️⃣ 录入/修改成绩</h3>
                            <form onSubmit={handleSubmitGrade} style={{ marginTop: 16 }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>课程</label>
                                        <select
                                            value={gradeForm.courseName}
                                            onChange={e => setGradeForm({ ...gradeForm, courseName: e.target.value })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 8,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.08)',
                                                color: '#fff'
                                            }}
                                        >
                                            <option value="">选择课程</option>
                                            {courses.map(c => (
                                                <option key={c.courseId} value={c.courseName}>{c.courseName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>平时成绩</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={gradeForm.regularScore}
                                            onChange={e => setGradeForm({ ...gradeForm, regularScore: parseInt(e.target.value) })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 8,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.08)',
                                                color: '#fff'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>期中成绩</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={gradeForm.midtermScore}
                                            onChange={e => setGradeForm({ ...gradeForm, midtermScore: parseInt(e.target.value) })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 8,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.08)',
                                                color: '#fff'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>实验成绩</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={gradeForm.labScore}
                                            onChange={e => setGradeForm({ ...gradeForm, labScore: parseInt(e.target.value) })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 8,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.08)',
                                                color: '#fff'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>期末成绩</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={gradeForm.finalExamScore}
                                            onChange={e => setGradeForm({ ...gradeForm, finalExamScore: parseInt(e.target.value) })}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: 8,
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                background: 'rgba(255,255,255,0.08)',
                                                color: '#fff'
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    style={{
                                        marginTop: 16,
                                        padding: '10px 24px',
                                        borderRadius: 8,
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
                                        color: '#000',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    💾 保存成绩
                                </button>
                            </form>
                        </div>

                        <div style={{ marginTop: 32 }}>
                            <h3>3️⃣ 已有成绩</h3>
                            <table className="class-table" style={{ marginTop: 16 }}>
                                <thead>
                                    <tr>
                                        <th>课程</th>
                                        <th>平时</th>
                                        <th>期中</th>
                                        <th>实验</th>
                                        <th>期末</th>
                                        <th>综合成绩</th>
                                        <th>操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedStudent.grades && selectedStudent.grades.map((g: any) => (
                                        <tr key={g.courseName}>
                                            <td>{g.courseName}</td>
                                            <td>{g.regularScore}</td>
                                            <td>{g.midtermScore}</td>
                                            <td>{g.labScore}</td>
                                            <td>{g.finalExamScore}</td>
                                            <td><strong>{g.comprehensiveScore}</strong></td>
                                            <td>
                                                <button
                                                    onClick={() => handleEditGrade(g)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        marginRight: 8,
                                                        borderRadius: 6,
                                                        border: 'none',
                                                        background: 'rgba(59,130,246,0.3)',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ✏️ 编辑
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGrade(g.courseName)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: 6,
                                                        border: 'none',
                                                        background: 'rgba(239,68,68,0.3)',
                                                        color: '#fff',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    🗑️ 删除
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

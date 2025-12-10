import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function StudentManagement() {
    const [students, setStudents] = useState<any[]>([])
    const [showAddForm, setShowAddForm] = useState(false)
    const [formData, setFormData] = useState({ studentId: '', name: '', gender: '男' })
    const [editMode, setEditMode] = useState<string | null>(null)

    useEffect(() => {
        loadStudents()
    }, [])

    const loadStudents = async () => {
        // 搜索空字符串会返回所有学生的前10个，这里我们需要修改逻辑
        const results = await api.searchStudents('2024') // 搜索学号前缀
        setStudents(results.data || [])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editMode) {
                await api.updateStudent(editMode, { name: formData.name, gender: formData.gender })
                alert('学生信息更新成功！')
            } else {
                await api.addStudent({ studentId: formData.studentId, name: formData.name, gender: formData.gender })
                alert('学生添加成功！')
            }
            setFormData({ studentId: '', name: '', gender: '男' })
            setShowAddForm(false)
            setEditMode(null)
            loadStudents()
        } catch (error) {
            alert('操作失败：' + error)
        }
    }

    const handleDelete = async (studentId: string) => {
        if (!confirm(`确定要删除学号为 ${studentId} 的学生吗？`)) return
        try {
            await api.deleteStudent(studentId)
            alert('学生删除成功！')
            loadStudents()
        } catch (error) {
            alert('删除失败：' + error)
        }
    }

    const handleEdit = (student: any) => {
        setFormData({ studentId: student.studentId, name: student.name, gender: student.gender })
        setEditMode(student.studentId)
        setShowAddForm(true)
    }

    return (
        <div className="page">
            <div className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2>👥 学生管理</h2>
                    <button
                        onClick={() => {
                            setShowAddForm(!showAddForm)
                            setEditMode(null)
                            setFormData({ studentId: '', name: '', gender: '男' })
                        }}
                        style={{
                            padding: '10px 20px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'linear-gradient(135deg, #6ee7b7, #3b82f6)',
                            color: '#000',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        {showAddForm ? '取消' : '➕ 添加学生'}
                    </button>
                </div>

                {showAddForm && (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            marginBottom: 24,
                            padding: 20,
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                    >
                        <h3>{editMode ? '✏️ 编辑学生' : '➕ 添加学生'}</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>学号</label>
                                <input
                                    type="text"
                                    value={formData.studentId}
                                    onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                    disabled={!!editMode}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: 8,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: editMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>姓名</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
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
                                <label style={{ display: 'block', marginBottom: 8, color: 'rgba(255,255,255,0.8)' }}>性别</label>
                                <select
                                    value={formData.gender}
                                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: 8,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.08)',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="男">男</option>
                                    <option value="女">女</option>
                                </select>
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
                            {editMode ? '更新' : '添加'}
                        </button>
                    </form>
                )}

                <table className="class-table">
                    <thead>
                        <tr>
                            <th>学号</th>
                            <th>姓名</th>
                            <th>性别</th>
                            <th>平均分</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.studentId}>
                                <td>{student.studentId}</td>
                                <td>{student.name}</td>
                                <td>{student.gender}</td>
                                <td>{student.avgScore}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(student)}
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
                                        onClick={() => handleDelete(student.studentId)}
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
        </div>
    )
}

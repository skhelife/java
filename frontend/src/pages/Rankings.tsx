import React, { useEffect, useState } from 'react'
import { mockApi } from '../services/mockApi'

export default function Rankings() {
    const [rankings, setRankings] = useState<any[]>([])
    const [topN, setTopN] = useState(50)
    const [loading, setLoading] = useState(true)
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [studentGrades, setStudentGrades] = useState<any[]>([])

    useEffect(() => {
        loadRankings()
    }, [topN])

    const loadRankings = async () => {
        setLoading(true)
        try {
            const res = await mockApi.getRankings(topN)
            const list = (res.data || []).map((item: any, idx: number) => {
                const student = item.student || item || {}
                return {
                    studentId: student.studentId || student.id || `s_${idx}`,
                    name: student.name || '未知',
                    avgScore: Math.round((item.avgScore || item.avg || 0) * 10) / 10,
                    rank: idx + 1,
                    badges: student.badges || [],
                    email: student.email || '',
                    phone: student.phone || '',
                    enrollDate: student.enrollDate || ''
                }
            })
            setRankings(list)
        } catch (error) {
            console.error('加载排行榜失败:', error)
            setRankings([])
        }
        setLoading(false)
    }

    const handleStudentClick = async (studentId: string) => {
        try {
            const detail = await mockApi.getStudentDetail(studentId)
            const student = detail.data || {}

            // 加载学生成绩
            const gradesRes = await mockApi.getGrades(1, 100, { studentId })
            const grades = gradesRes.data?.content || []

            // 计算统计数据
            const totalCredits = grades.reduce((sum: number, g: any) => sum + (g.credits || 3), 0)
            const avgScore = grades.length > 0
                ? Math.round(grades.reduce((sum: number, g: any) => sum + (g.comprehensiveScore || 0), 0) / grades.length * 10) / 10
                : 0

            setSelectedStudent({
                ...student,
                avgScore,
                totalCredits
            })
            setStudentGrades(grades)
        } catch (error) {
            console.error('加载学生详情失败:', error)
        }
    }

    return (
        <div className="page">
            <div className="glass-panel rankings">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2>🏆 学生排行榜</h2>
                    <select
                        value={topN}
                        onChange={e => setTopN(parseInt(e.target.value))}
                        style={{
                            padding: '10px 16px',
                            borderRadius: 8,
                            border: 'none',
                            background: 'rgba(255,255,255,0.1)',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <option value={10}>Top 10</option>
                        <option value={20}>Top 20</option>
                        <option value={50}>Top 50</option>
                        <option value={100}>Top 100</option>
                    </select>
                </div>

                {loading ? (
                    <div className="loading">加载中...</div>
                ) : rankings.length === 0 ? (
                    <div className="loading">暂无数据</div>
                ) : (
                    <ul className="ranking-list">
                        {rankings.map((student, index) => (
                            <li
                                key={student.studentId}
                                className={index < 3 ? 'top' : ''}
                                style={{ animationDelay: `${index * 0.05}s`, cursor: 'pointer' }}
                                onClick={() => handleStudentClick(student.studentId)}
                            >
                                <span className="rank">{student.rank <= 3 ? (student.rank === 1 ? '🥇' : student.rank === 2 ? '🥈' : '🥉') : `#${student.rank}`}</span>
                                <div className="avatar">{student.name.charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                    <div className="name">{student.name}</div>
                                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{student.studentId}</div>
                                    {student.badges && student.badges.length > 0 && (
                                        <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {student.badges.map((badge: string, i: number) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        fontSize: 11,
                                                        padding: '2px 8px',
                                                        borderRadius: 6,
                                                        background: 'rgba(255,215,0,0.2)',
                                                        border: '1px solid rgba(255,215,0,0.4)'
                                                    }}
                                                >
                                                    🏅 {badge}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="score">{student.avgScore}</span>
                                <span style={{ marginLeft: 10, fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>→</span>
                            </li>
                        ))}
                    </ul>
                )}

                {rankings.length >= topN && (
                    <div style={{ textAlign: 'center', marginTop: 24, color: 'rgba(255,255,255,0.6)' }}>
                        已显示前 {topN} 名学生
                    </div>
                )}
            </div>

            {/* 学生详情模态框 */}
            {selectedStudent && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: 20
                }} onClick={() => setSelectedStudent(null)}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
                        borderRadius: 16,
                        padding: 30,
                        maxWidth: 800,
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
                            <div>
                                <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
                                    👤 {selectedStudent.name}
                                </h2>
                                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                                    学号: {selectedStudent.studentId}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedStudent(null)}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    cursor: 'pointer',
                                    fontSize: 16
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 16,
                            marginBottom: 24
                        }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: 16, borderRadius: 8, border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <div style={{ color: 'rgba(147, 197, 253, 1)', fontSize: 13, marginBottom: 4 }}>平均分</div>
                                <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{selectedStudent.avgScore || 0}</div>
                            </div>
                            <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: 16, borderRadius: 8, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                                <div style={{ color: 'rgba(134, 239, 172, 1)', fontSize: 13, marginBottom: 4 }}>总学分</div>
                                <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{selectedStudent.totalCredits || 0}</div>
                            </div>
                            <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: 16, borderRadius: 8, border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                                <div style={{ color: 'rgba(216, 180, 254, 1)', fontSize: 13, marginBottom: 4 }}>课程数</div>
                                <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{studentGrades.length}</div>
                            </div>
                        </div>

                        <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                            📊 成绩详情
                        </h3>

                        {studentGrades.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                            <th style={{ padding: 12, textAlign: 'left', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>课程</th>
                                            <th style={{ padding: 12, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>教学班</th>
                                            <th style={{ padding: 12, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>成绩</th>
                                            <th style={{ padding: 12, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>等级</th>
                                            <th style={{ padding: 12, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>学分</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentGrades.map((grade: any, idx: number) => {
                                            const score = grade.comprehensiveScore || 0
                                            const level = score >= 90 ? '优秀' : score >= 80 ? '良好' : score >= 70 ? '中等' : score >= 60 ? '及格' : '不及格'
                                            const levelColor = score >= 90 ? '#10b981' : score >= 80 ? '#3b82f6' : score >= 70 ? '#eab308' : score >= 60 ? '#f59e0b' : '#ef4444'

                                            return (
                                                <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <td style={{ padding: 12, color: '#fff' }}>{grade.courseName || '未知课程'}</td>
                                                    <td style={{ padding: 12, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                                                        {grade.teachingClass?.classId || '未知班级'}
                                                    </td>
                                                    <td style={{ padding: 12, textAlign: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{score.toFixed(1)}</td>
                                                    <td style={{ padding: 12, textAlign: 'center' }}>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: 6,
                                                            background: `${levelColor}20`,
                                                            color: levelColor,
                                                            fontSize: 13,
                                                            fontWeight: 500
                                                        }}>
                                                            {level}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: 12, textAlign: 'center', color: 'rgba(255,255,255,0.8)' }}>{grade.credits || 3}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.5)' }}>
                                暂无成绩记录
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

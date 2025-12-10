import React, { useState, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react'
import { api } from '../services/api'

export default function StudentSearch() {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [studentGrades, setStudentGrades] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const handleSearch = async () => {
        if (!query) return
        setLoading(true)
        try {
            const results = await api.searchStudents(query)
            setSuggestions(results.data || [])
        } catch (error) {
            console.error('搜索失败:', error)
        }
        setLoading(false)
    }

    const handleSelectStudent = async (student: any) => {
        try {
            setLoading(true)
            // 传入的是完整学生对象
            setSelectedStudent(student)
            setSuggestions([])
            setQuery('')

            // 从搜索结果中获取完整学生信息
            const detailRes = await api.getStudentDetail(student.studentId)
            const fullStudent = detailRes.data || detailRes || student

            // grades字段可能在student对象中
            const grades = fullStudent.grades || []
            setStudentGrades(grades)

            // 计算统计信息
            const scores = grades.map((g: any) => g.comprehensiveScore || 0)
            const avg = scores.length ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0
            const max = scores.length ? Math.max(...scores) : 0
            const min = scores.length ? Math.min(...scores) : 0

            // 获取全表排名（请求较大，mockApi 支持 top 参数）
            const rankRes = await api.getRankings(1000)
            const rankings = rankRes.data || []
            const foundIndex = rankings.findIndex((r: any) => {
                const sid = r.student?.studentId || r.studentId
                return sid === fullStudent.studentId
            })
            const rank = foundIndex >= 0 ? foundIndex + 1 : null

            setSelectedStudent({
                ...fullStudent,
                avgScore: Math.round(avg * 100) / 100,
                maxScore: max,
                minScore: min,
                rank,
                badges: fullStudent.badges || []
            })
        } catch (error) {
            console.error('获取学生详情失败:', error)
            alert('获取学生详情失败,请重试')
        } finally {
            setLoading(false)
        }
    }

    const radarOption = selectedStudent && studentGrades.length > 0 ? {
        backgroundColor: 'transparent',
        title: {
            text: `${selectedStudent.name} (${selectedStudent.studentId}) - 成绩雷达图`,
            left: 'center',
            textStyle: { color: '#fff', fontSize: 16 }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
                return `${params.name}: ${params.value}`
            }
        },
        radar: {
            indicator: studentGrades.map((g: any) => ({
                name: g.courseName || '未知课程',
                max: 100
            })),
            splitArea: {
                areaStyle: {
                    color: ['rgba(110, 231, 183, 0.1)', 'rgba(59, 130, 246, 0.05)']
                }
            },
            axisLine: { lineStyle: { color: '#6ee7b7' } },
            splitLine: { lineStyle: { color: 'rgba(110, 231, 183, 0.3)' } }
        },
        series: [{
            type: 'radar',
            data: [{
                value: studentGrades.map((g: any) => g.comprehensiveScore || 0),
                name: '综合成绩',
                areaStyle: { color: 'rgba(110, 231, 183, 0.4)' },
                lineStyle: { color: '#6ee7b7', width: 2 },
                itemStyle: { color: '#6ee7b7' }
            }]
        }]
    } : {}

    return (
        <div className="page">
            <div className="glass-panel search">
                <h2>🔍 学生成绩查询</h2>
                <p className="text-sm text-gray-300 mb-4">输入学号或姓名搜索学生信息</p>
                <div className="search-row">
                    <input
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value)
                            if (e.target.value.length >= 2) {
                                api.searchStudents(e.target.value).then(res => setSuggestions(res.data || []))
                            } else {
                                setSuggestions([])
                            }
                        }}
                        placeholder="输入学号或姓名（支持智能联想）..."
                    />
                    <button onClick={handleSearch}>搜索</button>
                </div>

                {suggestions.length > 0 && (
                    <div className="results">
                        {suggestions.map(s => (
                            // 这里传入完整学生对象
                            <div key={s.studentId} className="student-card" onClick={() => handleSelectStudent(s)}>
                                <div className="avatar">{s.name.charAt(0)}</div>
                                <div className="info">
                                    <div className="name">{s.name} ({s.studentId})</div>
                                    <div className="avg">平均分：{s.avgScore}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedStudent && (
                    <div style={{ marginTop: 32 }}>
                        <div style={{ display: 'flex', gap: 20, marginBottom: 24 }}>
                            <div style={{ flex: 1 }}>
                                <h3>📋 学生信息</h3>
                                <div style={{ marginTop: 12 }}>
                                    <p><strong>姓名:</strong> {selectedStudent.name}</p>
                                    <p><strong>学号:</strong> {selectedStudent.studentId}</p>
                                    <p><strong>性别:</strong> {selectedStudent.gender}</p>
                                    <p><strong>平均分:</strong> {selectedStudent.avgScore}</p>
                                    <p><strong>最高分:</strong> {selectedStudent.maxScore}</p>
                                    <p><strong>最低分:</strong> {selectedStudent.minScore}</p>
                                    <p><strong>排名:</strong> {selectedStudent.rank ? `第 ${selectedStudent.rank} 名` : '—'}</p>
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3>🏆 成就徽章</h3>
                                <div className="badge-list" style={{ marginTop: 12 }}>
                                    {selectedStudent.badges && selectedStudent.badges.length > 0 ? (
                                        selectedStudent.badges.map((badge: string, i: number) => (
                                            <div key={i} className="badge">{badge}</div>
                                        ))
                                    ) : (
                                        <p style={{ color: 'rgba(255,255,255,0.6)' }}>暂无徽章</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h3>📊 各科成绩详情</h3>
                        <table className="class-table" style={{ marginTop: 12 }}>
                            <thead>
                                <tr>
                                    <th>课程名称</th>
                                    <th>平时</th>
                                    <th>期中</th>
                                    <th>实验</th>
                                    <th>期末</th>
                                    <th>综合成绩</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentGrades.map((g: any) => (
                                    <tr key={`${g.studentId}-${g.courseName}`}>
                                        <td>{g.courseName}</td>
                                        <td>{g.regularScore}</td>
                                        <td>{g.midtermScore}</td>
                                        <td>{g.labScore}</td>
                                        <td>{g.finalExamScore}</td>
                                        <td><strong>{g.comprehensiveScore}</strong></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ marginTop: 32 }}>
                            <ReactEcharts option={radarOption} style={{ height: 400 }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

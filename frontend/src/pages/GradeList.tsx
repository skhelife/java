import { useState, useEffect } from 'react'
import { api } from '../services/api'

export default function GradeList() {
    const [grades, setGrades] = useState<any[]>([])
    const [students, setStudents] = useState<any[]>([])
    const [classes, setClasses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [pageSize] = useState(50)
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [filters, setFilters] = useState({
        studentId: '',
        classId: '',
        minScore: '',
        maxScore: ''
    })
    const [showImportModal, setShowImportModal] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [stats, setStats] = useState<any>(null)
    const [showClassDetail, setShowClassDetail] = useState(false)
    const [selectedClass, setSelectedClass] = useState<any>(null)

    useEffect(() => {
        loadData()
    }, [page, filters])

    useEffect(() => {
        loadInitialData()
    }, [])

    const loadInitialData = async () => {
        try {
            const [studentsRes, classesRes, statsRes] = await Promise.all([
                api.getStudents(1, 1000),
                api.getClasses(),
                api.getStats()
            ])
            console.log('学生数据:', studentsRes)
            console.log('教学班数据:', classesRes)
            console.log('统计数据:', statsRes)

            setStudents(studentsRes.data?.content || studentsRes.data || [])
            setClasses(classesRes.data || [])
            setStats(statsRes.data)
        } catch (error) {
            console.error('加载基础数据失败:', error)
        }
    }

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await api.getGrades(page, pageSize, filters)
            console.log('成绩数据响应:', res)

            if (res.success && res.data) {
                setGrades(res.data.content || [])
                setTotal(res.data.totalElements || 0)
                setTotalPages(res.data.totalPages || 0)
            }
        } catch (error) {
            console.error('加载成绩失败:', error)
        }
        setLoading(false)
    }

    const handleFilter = () => {
        setPage(1)
        loadData()
    }

    const handleExport = async () => {
        try {
            const blob = await api.exportGrades(filters)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `grades-${new Date().toISOString().split('T')[0]}.xlsx`
            a.click()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            alert('导出失败: ' + error)
        }
    }

    const handleImport = async () => {
        if (!importFile) {
            alert('请选择文件')
            return
        }
        try {
            const result = await api.importGrades(importFile)
            alert(`导入成功！成功: ${result.data?.successCount || 0}, 失败: ${result.data?.failCount || 0}`)
            setShowImportModal(false)
            setImportFile(null)
            loadData()
        } catch (error) {
            alert('导入失败: ' + error)
        }
    }

    const handleClassClick = (classItem: any) => {
        console.log('点击班级:', classItem)
        setSelectedClass(classItem)
        setShowClassDetail(true)
    }

    const getLevelColor = (level: string) => {
        const colors: Record<string, { bg: string; color: string; border: string }> = {
            '优秀': { bg: 'rgba(34, 197, 94, 0.2)', color: 'rgba(134, 239, 172, 1)', border: 'rgba(34, 197, 94, 0.3)' },
            '良好': { bg: 'rgba(59, 130, 246, 0.2)', color: 'rgba(147, 197, 253, 1)', border: 'rgba(59, 130, 246, 0.3)' },
            '中等': { bg: 'rgba(234, 179, 8, 0.2)', color: 'rgba(250, 204, 21, 1)', border: 'rgba(234, 179, 8, 0.3)' },
            '及格': { bg: 'rgba(245, 158, 11, 0.2)', color: 'rgba(251, 191, 36, 1)', border: 'rgba(245, 158, 11, 0.3)' },
            '不及格': { bg: 'rgba(239, 68, 68, 0.2)', color: 'rgba(252, 165, 165, 1)', border: 'rgba(239, 68, 68, 0.3)' }
        }
        return colors[level] || colors['及格']
    }

    if (loading && grades.length === 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem' }}>
                <div>加载中...</div>
            </div>
        )
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>📊 成绩管理 (300名学生)</h1>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setShowImportModal(true)}
                        style={{
                            padding: '10px 16px',
                            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            color: '#fff',
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        📥 导入成绩
                    </button>
                    <button
                        onClick={handleExport}
                        style={{
                            padding: '10px 16px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            color: '#fff',
                            borderRadius: 8,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        📤 导出成绩
                    </button>
                </div>
            </div>

            {/* 统计卡片 */}
            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 16,
                    marginBottom: 24
                }}>
                    <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(147, 197, 253, 1)', fontSize: 13, marginBottom: 4 }}>学生总数</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.totalStudents || stats.studentCount || 0}</div>
                    </div>
                    <div style={{
                        background: 'rgba(244, 63, 94, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(244, 63, 94, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(251, 113, 133, 1)', fontSize: 13, marginBottom: 4 }}>课程总数</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.courseCount || 0}</div>
                    </div>
                    <div style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(99, 102, 241, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(165, 180, 252, 1)', fontSize: 13, marginBottom: 4 }}>教师总数</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.teacherCount || 0}</div>
                    </div>
                    <div style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(196, 181, 253, 1)', fontSize: 13, marginBottom: 4 }}>教学班数</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.classCount || 0}</div>
                    </div>
                    <div style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(168, 85, 247, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(216, 180, 254, 1)', fontSize: 13, marginBottom: 4 }}>成绩总数</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.totalGrades || stats.gradeCount || 0}</div>
                    </div>
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(134, 239, 172, 1)', fontSize: 13, marginBottom: 4 }}>平均分</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.avgScore?.toFixed(2) || '0.00'}</div>
                    </div>
                    <div style={{
                        background: 'rgba(234, 179, 8, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(234, 179, 8, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(250, 204, 21, 1)', fontSize: 13, marginBottom: 4 }}>及格率</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.passRate?.toFixed(1) || '0.0'}%</div>
                    </div>
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        padding: 20,
                        borderRadius: 12,
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(110, 231, 183, 1)', fontSize: 13, marginBottom: 4 }}>优秀率</div>
                        <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.excellentRate?.toFixed(1) || '0.0'}%</div>
                    </div>
                </div>
            )}

            {/* 筛选器 */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                padding: 20,
                marginBottom: 24,
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>学生</label>
                        <select
                            value={filters.studentId}
                            onChange={e => setFilters({ ...filters, studentId: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 8,
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">全部学生</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.studentId} - {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>教学班</label>
                        <select
                            value={filters.classId}
                            onChange={e => setFilters({ ...filters, classId: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 8,
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">全部班级</option>
                            {classes.map((c: any) => (
                                <option key={c.id} value={c.id}>
                                    {c.classId}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>最低分</label>
                        <input
                            type="number"
                            value={filters.minScore}
                            onChange={e => setFilters({ ...filters, minScore: e.target.value })}
                            placeholder="0"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 8,
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#fff'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>最高分</label>
                        <input
                            type="number"
                            value={filters.maxScore}
                            onChange={e => setFilters({ ...filters, maxScore: e.target.value })}
                            placeholder="100"
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: 8,
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#fff'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                            onClick={handleFilter}
                            style={{
                                width: '100%',
                                padding: '10px 16px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                color: '#fff',
                                borderRadius: 8,
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            🔍 筛选
                        </button>
                    </div>
                </div>
            </div>

            {/* 成绩列表 */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 12,
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>学号</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>姓名</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>班级</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>平时</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>期中</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>实验</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>期末</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>综合成绩</th>
                                <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>等级</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>录入时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((grade, index) => (
                                <tr key={grade.id} style={{
                                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                    transition: 'all 0.2s',
                                    background: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                                }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                                        e.currentTarget.style.transform = 'scale(1.01)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                                        e.currentTarget.style.transform = 'scale(1)'
                                    }}
                                >
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontWeight: 600, color: 'rgba(147, 197, 253, 1)' }}>
                                        {grade.student?.studentId}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', color: 'rgba(255, 255, 255, 0.9)' }}>
                                        {grade.student?.name}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: 14, color: 'rgba(216, 180, 254, 1)' }}>
                                        <span
                                            onClick={() => {
                                                console.log('当前成绩项:', grade)
                                                console.log('教学班ID:', grade.teachingClass?.id)
                                                console.log('所有班级:', classes)

                                                if (!grade.teachingClass?.id) {
                                                    console.warn('成绩记录没有教学班ID')
                                                    alert('该成绩记录没有关联的教学班信息')
                                                    return
                                                }

                                                const classItem = classes.find(c => c.id === grade.teachingClass?.id)
                                                console.log('找到的班级:', classItem)

                                                if (classItem) {
                                                    handleClassClick(classItem)
                                                } else {
                                                    console.warn('未找到对应的班级数据')
                                                    alert('未找到该班级的详细信息')
                                                }
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: 6,
                                                background: 'rgba(168, 85, 247, 0.2)',
                                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.3)'
                                                e.currentTarget.style.transform = 'scale(1.05)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)'
                                                e.currentTarget.style.transform = 'scale(1)'
                                            }}
                                        >
                                            {grade.teachingClass?.classId}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                                        {grade.regularScore?.toFixed(1)}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                                        {grade.midtermScore?.toFixed(1)}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                                        {grade.labScore?.toFixed(1)}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                                        {grade.finalExamScore?.toFixed(1)}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontWeight: 700, fontSize: 18, textAlign: 'center', color: 'rgba(134, 239, 172, 1)' }}>
                                        {grade.comprehensiveScore?.toFixed(1)}
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', textAlign: 'center' }}>
                                        <span style={{
                                            padding: '6px 12px',
                                            fontSize: 12,
                                            borderRadius: 6,
                                            fontWeight: 600,
                                            ...getLevelColor(grade.level),
                                            background: getLevelColor(grade.level).bg,
                                            color: getLevelColor(grade.level).color,
                                            border: `1px solid ${getLevelColor(grade.level).border}`
                                        }}>
                                            {grade.level}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: 14, color: 'rgba(255, 255, 255, 0.5)' }}>
                                        {grade.createdTime ? new Date(grade.createdTime).toLocaleDateString() : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 分页 */}
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.7)' }}>
                    共 {total} 条记录 | 显示第 {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} 条
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 8,
                            background: page === 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                            color: page === 1 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
                            cursor: page === 1 ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        上一页
                    </button>
                    <span style={{ padding: '8px 16px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                        第 {page} / {totalPages || Math.ceil(total / pageSize)} 页
                    </span>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                        style={{
                            padding: '8px 16px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 8,
                            background: page >= totalPages ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                            color: page >= totalPages ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.9)',
                            cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                            fontWeight: 500
                        }}
                    >
                        下一页
                    </button>
                </div>
            </div>

            {/* 当前页统计 */}
            {grades.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 16,
                    marginTop: 24
                }}>
                    <div style={{
                        background: 'rgba(234, 179, 8, 0.1)',
                        padding: 16,
                        borderRadius: 12,
                        border: '1px solid rgba(234, 179, 8, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(250, 204, 21, 1)', fontSize: 12, marginBottom: 4 }}>当前页平均分</div>
                        <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                            {(grades.reduce((sum, g) => sum + (g.comprehensiveScore || 0), 0) / grades.length).toFixed(1)}
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        padding: 16,
                        borderRadius: 12,
                        border: '1px solid rgba(168, 85, 247, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(216, 180, 254, 1)', fontSize: 12, marginBottom: 4 }}>当前页及格率</div>
                        <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                            {((grades.filter(g => g.level !== '不及格').length / grades.length) * 100).toFixed(1)}%
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: 16,
                        borderRadius: 12,
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(252, 165, 165, 1)', fontSize: 12, marginBottom: 4 }}>不及格人数</div>
                        <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                            {grades.filter(g => g.level === '不及格').length}
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        padding: 16,
                        borderRadius: 12,
                        border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                        <div style={{ color: 'rgba(134, 239, 172, 1)', fontSize: 12, marginBottom: 4 }}>优秀人数</div>
                        <div style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>
                            {grades.filter(g => g.level === '优秀').length}
                        </div>
                    </div>
                </div>
            )}

            {/* 导入模态框 */}
            {showImportModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.95))',
                        borderRadius: 16,
                        padding: 32,
                        width: '100%',
                        maxWidth: 500,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                    }}>
                        <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#fff' }}>📥 批量导入成绩</h2>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 12, color: 'rgba(255, 255, 255, 0.9)' }}>选择Excel文件</label>
                            <input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={e => setImportFile(e.target.files?.[0] || null)}
                                style={{
                                    width: '100%',
                                    padding: 12,
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: 8,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff'
                                }}
                            />
                            <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)', marginTop: 16 }}>
                                <p style={{ marginBottom: 8 }}>文件格式要求：</p>
                                <ul style={{ listStyleType: 'disc', paddingLeft: 20, marginTop: 8 }}>
                                    <li>学号、姓名、课程、平时、期中、实验、期末</li>
                                    <li>Excel格式 (.xlsx 或 .xls)</li>
                                </ul>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                            <button
                                onClick={() => {
                                    setShowImportModal(false)
                                    setImportFile(null)
                                }}
                                style={{
                                    padding: '10px 20px',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: 8,
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                取消
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!importFile}
                                style={{
                                    padding: '10px 20px',
                                    background: importFile ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.1)',
                                    color: importFile ? '#fff' : 'rgba(255, 255, 255, 0.3)',
                                    borderRadius: 8,
                                    border: 'none',
                                    cursor: importFile ? 'pointer' : 'not-allowed',
                                    fontWeight: 600
                                }}
                            >
                                开始导入
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 班级详情模态框 */}
            {showClassDetail && selectedClass && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(30, 30, 40, 0.95), rgba(20, 20, 30, 0.95))',
                        borderRadius: 16,
                        padding: 32,
                        width: '100%',
                        maxWidth: 600,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>📚 班级详情</h2>
                            <button
                                onClick={() => setShowClassDetail(false)}
                                style={{
                                    padding: '8px 16px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: 'none',
                                    borderRadius: 8,
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                ✕ 关闭
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: 16 }}>
                            <div style={{
                                background: 'rgba(168, 85, 247, 0.1)',
                                padding: 20,
                                borderRadius: 12,
                                border: '1px solid rgba(168, 85, 247, 0.2)'
                            }}>
                                <div style={{ color: 'rgba(216, 180, 254, 1)', fontSize: 13, marginBottom: 4 }}>班级编号</div>
                                <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{selectedClass.classId}</div>
                            </div>
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                padding: 20,
                                borderRadius: 12,
                                border: '1px solid rgba(59, 130, 246, 0.2)'
                            }}>
                                <div style={{ color: 'rgba(147, 197, 253, 1)', fontSize: 13, marginBottom: 4 }}>课程名称</div>
                                <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                    {selectedClass.course?.courseName || '未知课程'}
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(34, 197, 94, 0.1)',
                                padding: 20,
                                borderRadius: 12,
                                border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}>
                                <div style={{ color: 'rgba(134, 239, 172, 1)', fontSize: 13, marginBottom: 4 }}>任课教师</div>
                                <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                    {selectedClass.teacher?.name || '未分配'}
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(234, 179, 8, 0.1)',
                                padding: 20,
                                borderRadius: 12,
                                border: '1px solid rgba(234, 179, 8, 0.2)'
                            }}>
                                <div style={{ color: 'rgba(250, 204, 21, 1)', fontSize: 13, marginBottom: 4 }}>学生人数</div>
                                <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                    {grades.filter(g => g.teachingClass?.id === selectedClass.id).length} 人
                                </div>
                            </div>
                            <div style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                padding: 20,
                                borderRadius: 12,
                                border: '1px solid rgba(244, 63, 94, 0.2)'
                            }}>
                                <div style={{ color: 'rgba(251, 113, 133, 1)', fontSize: 13, marginBottom: 4 }}>班级平均分</div>
                                <div style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                    {(() => {
                                        const classGrades = grades.filter(g => g.teachingClass?.id === selectedClass.id)
                                        if (classGrades.length === 0) return '0.0'
                                        const avg = classGrades.reduce((sum, g) => sum + (g.comprehensiveScore || 0), 0) / classGrades.length
                                        return avg.toFixed(1)
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

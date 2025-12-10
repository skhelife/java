import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { api } from '../services/api'
import 'echarts-gl'

export default function ClassDistribution() {
    const [classes, setClasses] = useState<any[]>([])
    const [selectedClass, setSelectedClass] = useState<any>(null)
    const [chartType, setChartType] = useState<'2d' | '3d' | 'pie'>('2d')

    useEffect(() => {
        api.getClasses().then(res => setClasses(res.data || []))
    }, [])

    const handleClassClick = async (classId: string) => {
        const detail = await api.getClassDetail(classId)
        setSelectedClass(detail.data)
    }

    const get2DOption = () => {
        if (!selectedClass) return {}
        const dist = selectedClass.distribution
        return {
            backgroundColor: 'transparent',
            title: {
                text: `${selectedClass.course.courseName} - 成绩分布`,
                left: 'center',
                textStyle: { color: '#fff', fontSize: 18 }
            },
            tooltip: { trigger: 'axis' },
            grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
            xAxis: {
                type: 'category',
                data: Object.keys(dist),
                axisLine: { lineStyle: { color: '#888' } }
            },
            yAxis: {
                type: 'value',
                axisLine: { lineStyle: { color: '#888' } }
            },
            series: [{
                type: 'bar',
                data: Object.values(dist),
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#6ee7b7' },
                            { offset: 1, color: '#3b82f6' }
                        ]
                    }
                },
                label: { show: true, position: 'top', color: '#fff' }
            }]
        }
    }

    const get3DOption = () => {
        if (!selectedClass) return {}
        const dist = selectedClass.distribution
        const data = Object.entries(dist).map(([k, v], i) => [i, v, 0])
        return {
            backgroundColor: 'transparent',
            title: {
                text: `${selectedClass.course.courseName} - 3D 分布`,
                left: 'center',
                textStyle: { color: '#fff' }
            },
            tooltip: {},
            xAxis3D: { type: 'category', data: Object.keys(dist) },
            yAxis3D: { type: 'value' },
            zAxis3D: { type: 'value' },
            grid3D: {
                boxWidth: 200,
                boxDepth: 80,
                viewControl: { autoRotate: true, autoRotateSpeed: 5 },
                light: { main: { intensity: 1.2 }, ambient: { intensity: 0.3 } }
            },
            series: [{
                type: 'bar3D',
                data: data.map((d, i) => [...d, Object.values(dist)[i]]),
                shading: 'lambert',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#6ee7b7' },
                            { offset: 1, color: '#3b82f6' }
                        ]
                    }
                }
            }]
        }
    }

    const getPieOption = () => {
        if (!selectedClass) return {}
        const dist = selectedClass.distribution
        return {
            backgroundColor: 'transparent',
            title: {
                text: `${selectedClass.course.courseName} - 饼图分布`,
                left: 'center',
                textStyle: { color: '#fff' }
            },
            tooltip: { trigger: 'item' },
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                data: Object.entries(dist).map(([k, v]) => ({ name: k, value: v })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: { color: '#fff' }
            }]
        }
    }

    const chartOption = chartType === '2d' ? get2DOption() : chartType === '3d' ? get3DOption() : getPieOption()

    return (
        <div className="page">
            <div className="glass-panel">
                <h2>📚 教学班列表</h2>
                <table className="class-table">
                    <thead>
                        <tr>
                            <th>班级编号</th>
                            <th>课程名称</th>
                            <th>任课教师</th>
                            <th>学生数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(c => (
                            <tr key={c.classId} onClick={() => handleClassClick(c.classId)}>
                                <td>{c.classId}</td>
                                <td>{c.courseName}</td>
                                <td>{c.teacherName}</td>
                                <td>{c.studentCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedClass && (
                <div className="glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h3>📊 成绩分布可视化</h3>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                onClick={() => setChartType('2d')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: chartType === '2d' ? 'linear-gradient(135deg, #6ee7b7, #3b82f6)' : 'rgba(255,255,255,0.1)',
                                    color: chartType === '2d' ? '#000' : '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                2D 柱状
                            </button>
                            <button
                                onClick={() => setChartType('3d')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: chartType === '3d' ? 'linear-gradient(135deg, #6ee7b7, #3b82f6)' : 'rgba(255,255,255,0.1)',
                                    color: chartType === '3d' ? '#000' : '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                3D 柱状
                            </button>
                            <button
                                onClick={() => setChartType('pie')}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: 8,
                                    border: 'none',
                                    background: chartType === 'pie' ? 'linear-gradient(135deg, #6ee7b7, #3b82f6)' : 'rgba(255,255,255,0.1)',
                                    color: chartType === 'pie' ? '#000' : '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                饼图
                            </button>
                        </div>
                    </div>
                    <ReactEcharts option={chartOption} style={{ height: 500 }} />
                </div>
            )}
        </div>
    )
}

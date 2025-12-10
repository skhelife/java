import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { mockApi } from '../services/mockApi'

export default function Stats() {
    const [stats, setStats] = useState<any>(null)
    const [distribution, setDistribution] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, distRes] = await Promise.all([
                    mockApi.getStats(),
                    mockApi.getDistribution()
                ])
                setStats(statsRes.data)
                setDistribution(distRes.data)
            } catch (error) {
                console.error('加载统计数据失败:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const pieOption = distribution ? {
        backgroundColor: 'transparent',
        title: {
            text: '成绩等级分布',
            left: 'center',
            top: 20,
            textStyle: { color: '#fff', fontSize: 20, fontWeight: 600 }
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: 'rgba(110, 231, 183, 0.5)',
            textStyle: { color: '#fff' },
            formatter: '{b}: {c}人 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: '10%',
            top: 'center',
            textStyle: { color: '#fff', fontSize: 14 },
            data: ['不及格(0-59)', '及格(60-69)', '中等(70-79)', '良好(80-89)', '优秀(90-100)']
        },
        series: [{
            type: 'pie',
            radius: ['35%', '65%'],
            center: ['40%', '55%'],
            data: [
                { name: '不及格(0-59)', value: distribution['0-59'] || 0 },
                { name: '及格(60-69)', value: distribution['60-69'] || 0 },
                { name: '中等(70-79)', value: distribution['70-79'] || 0 },
                { name: '良好(80-89)', value: distribution['80-89'] || 0 },
                { name: '优秀(90-100)', value: distribution['90-100'] || 0 }
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 15,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            label: {
                color: '#fff',
                fontSize: 13,
                formatter: '{b}\n{c}人\n{d}%'
            },
            itemStyle: {
                borderRadius: 8,
                borderColor: 'rgba(0,0,0,0.3)',
                borderWidth: 2
            },
            color: [
                '#ef4444', // 红色 - 不及格
                '#f59e0b', // 橙色 - 及格
                '#eab308', // 黄色 - 中等
                '#3b82f6', // 蓝色 - 良好
                '#10b981'  // 绿色 - 优秀
            ]
        }]
    } : {}

    const barOption = distribution ? {
        backgroundColor: 'transparent',
        title: {
            text: '成绩分布柱状图',
            left: 'center',
            top: 20,
            textStyle: { color: '#fff', fontSize: 20, fontWeight: 600 }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: 'rgba(110, 231, 183, 0.5)',
            textStyle: { color: '#fff' },
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['不及格\n0-59分', '及格\n60-69分', '中等\n70-79分', '良好\n80-89分', '优秀\n90-100分'],
            axisLine: { lineStyle: { color: '#888' } },
            axisLabel: {
                color: '#fff',
                fontSize: 13,
                fontWeight: 500,
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '人数',
            nameTextStyle: { color: '#fff', fontSize: 14 },
            axisLine: { lineStyle: { color: '#888' } },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [{
            type: 'bar',
            data: [
                { value: distribution['0-59'] || 0, itemStyle: { color: '#ef4444' } },
                { value: distribution['60-69'] || 0, itemStyle: { color: '#f59e0b' } },
                { value: distribution['70-79'] || 0, itemStyle: { color: '#eab308' } },
                { value: distribution['80-89'] || 0, itemStyle: { color: '#3b82f6' } },
                { value: distribution['90-100'] || 0, itemStyle: { color: '#10b981' } }
            ],
            barWidth: '50%',
            label: {
                show: true,
                position: 'top',
                color: '#fff',
                fontSize: 15,
                fontWeight: 600,
                formatter: '{c}人'
            },
            animationDuration: 1500,
            animationEasing: 'elasticOut',
            itemStyle: {
                borderRadius: [8, 8, 0, 0],
                shadowBlur: 10,
                shadowColor: 'rgba(0,0,0,0.3)'
            }
        }]
    } : {}

    const lineOption = {
        backgroundColor: 'transparent',
        title: {
            text: '平均分趋势分析',
            left: 'center',
            top: 20,
            textStyle: { color: '#fff', fontSize: 20, fontWeight: 600 }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: 'rgba(110, 231, 183, 0.5)',
            textStyle: { color: '#fff' }
        },
        grid: { left: '8%', right: '8%', bottom: '15%', top: '20%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周'],
            axisLine: { lineStyle: { color: '#888' } },
            axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
            type: 'value',
            name: '平均分',
            nameTextStyle: { color: '#fff', fontSize: 14 },
            axisLine: { lineStyle: { color: '#888' } },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [{
            name: '平均分',
            type: 'line',
            smooth: true,
            data: [75, 77, 78, 79, 80, 81],
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(110, 231, 183, 0.5)' },
                        { offset: 1, color: 'rgba(110, 231, 183, 0.1)' }
                    ]
                }
            },
            lineStyle: { color: '#6ee7b7', width: 3 },
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
                color: '#6ee7b7',
                borderColor: '#fff',
                borderWidth: 2
            }
        }]
    }

    return (
        <div className="page">
            <div className="glass-panel stats">
                <h2>📉 系统统计分析</h2>

                {stats && (
                    <>
                        <div className="stat-grid">
                            <div className="stat">
                                学生总数<br /><strong>{stats.totalStudents}</strong>
                            </div>
                            <div className="stat">
                                课程总数<br /><strong>{stats.totalCourses}</strong>
                            </div>
                            <div className="stat">
                                教师总数<br /><strong>{stats.totalTeachers}</strong>
                            </div>
                            <div className="stat">
                                教学班数<br /><strong>{stats.totalClasses}</strong>
                            </div>
                            <div className="stat">
                                平均分<br /><strong>{stats.avgScore}</strong>
                            </div>
                            <div className="stat">
                                优秀率<br /><strong>{stats.excellentRate}%</strong>
                            </div>
                            <div className="stat">
                                及格率<br /><strong>{stats.passRate}%</strong>
                            </div>
                            <div className="stat">
                                成绩记录<br /><strong>{stats.totalGrades}</strong>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 32 }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 12 }}>
                                <ReactEcharts option={barOption} style={{ height: 350 }} />
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 24, borderRadius: 12 }}>
                                <ReactEcharts option={pieOption} style={{ height: 350 }} />
                            </div>
                        </div>

                        <div style={{ marginTop: 24, padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                            <ReactEcharts option={lineOption} style={{ height: 300 }} />
                        </div>

                        <div style={{ marginTop: 32, padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
                            <h3>💡 智能分析</h3>
                            <div style={{ marginTop: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                                <p>• 全校平均分为 <strong style={{ color: '#6ee7b7' }}>{stats.avgScore}</strong>，处于良好水平</p>
                                <p>• 优秀率达到 <strong style={{ color: '#6ee7b7' }}>{stats.excellentRate}%</strong>，{stats.excellentRate >= 30 ? '表现优异' : '有提升空间'}</p>
                                <p>• 及格率为 <strong style={{ color: '#6ee7b7' }}>{stats.passRate}%</strong>，整体成绩{stats.passRate >= 90 ? '非常稳定' : '需要关注'}</p>
                                <p>• 系统共记录 <strong style={{ color: '#6ee7b7' }}>{stats.totalGrades}</strong> 条成绩数据，数据完整度高</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

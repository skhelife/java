import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { mockApi } from '../services/mockApi'

export default function Home() {
    const [stats, setStats] = useState<any>(null)
    const [distribution, setDistribution] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const [statsRes, distRes] = await Promise.all([
                    mockApi.getStats(),
                    mockApi.getDistribution()
                ])

                console.log('📊 统计数据:', statsRes)
                console.log('📈 分布数据:', distRes)

                // mockApi返回 { success, data } 格式
                setStats(statsRes.data)
                setDistribution(distRes.data)
            } catch (error) {
                console.error('加载数据失败:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const chartOption = {
        backgroundColor: 'transparent',
        title: {
            text: '全校成绩分布',
            left: 'center',
            textStyle: { color: '#fff', fontSize: 18, fontWeight: 600 }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderColor: 'rgba(110, 231, 183, 0.5)',
            textStyle: { color: '#fff' }
        },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['0-59分', '60-69分', '70-79分', '80-89分', '90-100分'],
            axisLine: { lineStyle: { color: '#888' } },
            axisLabel: { color: '#fff', fontSize: 12 }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#888' } },
            axisLabel: { color: '#fff' },
            splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
        },
        series: [{
            type: 'bar',
            data: distribution ? [
                distribution.fail || 0,
                distribution.pass || 0,
                distribution.medium || 0,
                distribution.good || 0,
                distribution.excellent || 0
            ] : [0, 0, 0, 0, 0],
            itemStyle: {
                color: (params: any) => {
                    const colors = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#10b981']
                    return colors[params.dataIndex] || '#6ee7b7'
                },
                borderRadius: [8, 8, 0, 0]
            },
            barWidth: '60%',
            label: {
                show: true,
                position: 'top',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600
            },
            animationDuration: 1500,
            animationEasing: 'elasticOut'
        }]
    }

    if (loading) {
        return (
            <div className="page home">
                <div className="glass-panel hero">
                    <h1>🎓 学生成绩管理系统</h1>
                    <p>正在加载数据...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="page home">
            <div className="glass-panel hero">
                <h1>🎓 学生成绩管理系统</h1>
                <p>智能化 · 可视化 · 现代化成绩分析平台</p>
                <div className="ai-assistant">🤖 AI 智能助手（点击体验）</div>
            </div>

            {stats && (
                <div className="glass-panel">
                    <h3>快速统计</h3>
                    <div className="quick-stats">
                        <div className="stat-card">
                            <div className="number">{stats.totalStudents || 0}</div>
                            <div className="label">学生总数</div>
                        </div>
                        <div className="stat-card">
                            <div className="number">{stats.totalGrades || 0}</div>
                            <div className="label">成绩记录</div>
                        </div>
                        <div className="stat-card">
                            <div className="number">{stats.avgScore?.toFixed(2) || 0}</div>
                            <div className="label">平均分</div>
                        </div>
                        <div className="stat-card">
                            <div className="number">{stats.passRate?.toFixed(1) || 0}%</div>
                            <div className="label">优秀率</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="glass-panel" style={{ gridColumn: '1 / 3' }}>
                <ReactEcharts option={chartOption} style={{ height: 350 }} />
            </div>

            <div className="glass-panel badges">
                <h3>🏆 成就系统</h3>
                <div className="badge-list">
                    <div className="badge">🏅 满分达人</div>
                    <div className="badge">📈 进步之星</div>
                    <div className="badge">👑 稳定王者</div>
                    <div className="badge">🎖️ 学霸徽章</div>
                </div>
            </div>
        </div>
    )
}

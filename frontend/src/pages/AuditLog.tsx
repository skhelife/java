import React, { useState, useEffect } from 'react'
import { mockApi } from '../services/mockApi'

export default function AuditLog() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [total, setTotal] = useState(0)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [filters, setFilters] = useState({
    operationType: '',
    username: '',
    result: '',
    startDate: '',
    endDate: ''
  })
  const [stats, setStats] = useState({
    totalOps: 0,
    successRate: 0,
    todayOps: 0,
    failedOps: 0
  })

  useEffect(() => {
    loadLogs()
  }, [page])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const res = await mockApi.getLogs(page, pageSize, filters)
      const logsData = res.data?.content || res.data || []
      setLogs(logsData)
      setTotal(res.data?.totalElements || logsData.length)

      // 计算统计数据
      const successCount = logsData.filter((l: any) => l.result === 'SUCCESS').length
      const todayCount = logsData.filter((l: any) => {
        const logDate = new Date(l.operationTime).toDateString()
        const today = new Date().toDateString()
        return logDate === today
      }).length

      setStats({
        totalOps: logsData.length,
        successRate: logsData.length > 0 ? Math.round((successCount / logsData.length) * 100) : 0,
        todayOps: todayCount,
        failedOps: logsData.length - successCount
      })
    } catch (error) {
      console.error('加载日志失败:', error)
    }
    setLoading(false)
  }

  const handleFilter = () => {
    setPage(1)
    loadLogs()
  }

  const handleExport = () => {
    alert('导出功能: 将导出当前筛选的日志数据')
  }

  const getOperationTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; color: string; border: string }> = {
      'LOGIN': { bg: 'rgba(59, 130, 246, 0.2)', color: 'rgba(147, 197, 253, 1)', border: 'rgba(59, 130, 246, 0.3)' },
      'CREATE': { bg: 'rgba(34, 197, 94, 0.2)', color: 'rgba(134, 239, 172, 1)', border: 'rgba(34, 197, 94, 0.3)' },
      'UPDATE': { bg: 'rgba(234, 179, 8, 0.2)', color: 'rgba(250, 204, 21, 1)', border: 'rgba(234, 179, 8, 0.3)' },
      'DELETE': { bg: 'rgba(239, 68, 68, 0.2)', color: 'rgba(252, 165, 165, 1)', border: 'rgba(239, 68, 68, 0.3)' },
      'VIEW': { bg: 'rgba(156, 163, 175, 0.2)', color: 'rgba(209, 213, 219, 1)', border: 'rgba(156, 163, 175, 0.3)' },
      'EXPORT': { bg: 'rgba(168, 85, 247, 0.2)', color: 'rgba(216, 180, 254, 1)', border: 'rgba(168, 85, 247, 0.3)' },
      'IMPORT': { bg: 'rgba(99, 102, 241, 0.2)', color: 'rgba(165, 180, 252, 1)', border: 'rgba(99, 102, 241, 0.3)' }
    }
    return colors[type] || colors['VIEW']
  }

  const getResultColor = (result: string) => {
    return result === 'SUCCESS'
      ? { bg: 'rgba(34, 197, 94, 0.2)', color: 'rgba(134, 239, 172, 1)', border: 'rgba(34, 197, 94, 0.3)' }
      : { bg: 'rgba(239, 68, 68, 0.2)', color: 'rgba(252, 165, 165, 1)', border: 'rgba(239, 68, 68, 0.3)' }
  }

  if (loading && logs.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.25rem' }}>
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>📋 审计日志</h1>
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
          📥 导出日志
        </button>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 24
      }}>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: 20,
          borderRadius: 12,
          border: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ color: 'rgba(147, 197, 253, 1)', fontSize: 13, marginBottom: 4 }}>总操作数</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.totalOps}</div>
        </div>
        <div style={{
          background: 'rgba(34, 197, 94, 0.1)',
          padding: 20,
          borderRadius: 12,
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{ color: 'rgba(134, 239, 172, 1)', fontSize: 13, marginBottom: 4 }}>成功率</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.successRate}%</div>
        </div>
        <div style={{
          background: 'rgba(234, 179, 8, 0.1)',
          padding: 20,
          borderRadius: 12,
          border: '1px solid rgba(234, 179, 8, 0.2)'
        }}>
          <div style={{ color: 'rgba(250, 204, 21, 1)', fontSize: 13, marginBottom: 4 }}>今日操作</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.todayOps}</div>
        </div>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          padding: 20,
          borderRadius: 12,
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ color: 'rgba(252, 165, 165, 1)', fontSize: 13, marginBottom: 4 }}>失败次数</div>
          <div style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{stats.failedOps}</div>
        </div>
      </div>

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
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>操作类型</label>
            <select
              value={filters.operationType}
              onChange={e => setFilters({ ...filters, operationType: e.target.value })}
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
              <option value="">全部</option>
              <option value="LOGIN">登录</option>
              <option value="CREATE">创建</option>
              <option value="UPDATE">更新</option>
              <option value="DELETE">删除</option>
              <option value="VIEW">查看</option>
              <option value="EXPORT">导出</option>
              <option value="IMPORT">导入</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>用户名</label>
            <input
              type="text"
              value={filters.username}
              onChange={e => setFilters({ ...filters, username: e.target.value })}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#fff'
              }}
              placeholder="搜索用户名"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>执行结果</label>
            <select
              value={filters.result}
              onChange={e => setFilters({ ...filters, result: e.target.value })}
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
              <option value="">全部</option>
              <option value="SUCCESS">成功</option>
              <option value="FAILED">失败</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 8, color: 'rgba(255, 255, 255, 0.8)' }}>开始日期</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={e => setFilters({ ...filters, startDate: e.target.value })}
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
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
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

      {/* 日志列表 */}
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
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>时间</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>用户</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>操作类型</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>目标</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>描述</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>IP地址</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>结果</th>
                <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: 11, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase' }}>耗时</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const opColor = getOperationTypeColor(log.operationType)
                const resColor = getResultColor(log.result)
                return (
                  <tr
                    key={log.id}
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                    onClick={() => setSelectedLog(log)}
                  >
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: 13, color: 'rgba(255, 255, 255, 0.9)' }}>
                      {new Date(log.createdTime).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 500, color: '#fff' }}>{log.username}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>ID: {log.userId}</div>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: 11,
                        borderRadius: 6,
                        background: opColor.bg,
                        color: opColor.color,
                        border: `1px solid ${opColor.border}`,
                        fontWeight: 500
                      }}>
                        {log.operationType}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 13, color: '#fff' }}>{log.targetType}</div>
                      {log.targetId && (
                        <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)' }}>ID: {log.targetId}</div>
                      )}
                    </td>
                    <td style={{ padding: '16px 24px', maxWidth: 300 }}>
                      <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {log.description}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: 13, color: 'rgba(255, 255, 255, 0.7)' }}>
                      {log.ipAddress}
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                      <span style={{
                        padding: '4px 8px',
                        fontSize: 11,
                        borderRadius: 6,
                        background: resColor.bg,
                        color: resColor.color,
                        border: `1px solid ${resColor.border}`,
                        fontWeight: 500
                      }}>
                        {log.result === 'SUCCESS' ? '✓ 成功' : '✗ 失败'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', whiteSpace: 'nowrap', fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
                      {log.executionTime}ms
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.6)' }}>
            共 {total} 条记录，第 {page} 页
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: page === 1 ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.1)',
                color: page === 1 ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontSize: 13
              }}
            >
              ← 上一页
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={logs.length < pageSize}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: logs.length < pageSize ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.1)',
                color: logs.length < pageSize ? 'rgba(255, 255, 255, 0.3)' : '#fff',
                cursor: logs.length < pageSize ? 'not-allowed' : 'pointer',
                fontSize: 13
              }}
            >
              下一页 →
            </button>
          </div>
        </div>
      </div>

      {/* 详情模态框 */}
      {selectedLog && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }} onClick={() => setSelectedLog(null)}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderRadius: 16,
            padding: 30,
            maxWidth: 600,
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
              <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>📋 操作详情</h2>
              <button
                onClick={() => setSelectedLog(null)}
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

            <div style={{ display: 'grid', gap: 16 }}>
              {Object.entries(selectedLog).map(([key, value]) => (
                <div key={key} style={{
                  padding: 12,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 8,
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 4, textTransform: 'uppercase' }}>
                    {key}
                  </div>
                  <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

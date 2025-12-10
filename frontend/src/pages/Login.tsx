import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      
      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('username', data.username)
        localStorage.setItem('role', data.role)
        navigate('/')
      } else {
        alert('登录失败：' + (data.message || '用户名或密码错误'))
      }
    } catch (error) {
      alert('登录失败：网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 动态背景 */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s linear infinite'
      }} />

      {/* 登录卡片 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '400px',
        padding: '40px',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          🎓 学生成绩管理系统
        </h1>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
          整合RBAC权限管理
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin / teacher1 / student1"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: 500 }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="默认密码: 123456"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onFocus={e => e.target.style.borderColor = '#667eea'}
              onBlur={e => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              transform: loading ? 'none' : 'scale(1)'
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={e => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          >
            {loading ? '登录中...' : '🚀 登录系统'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', color: '#666', fontSize: '13px' }}>
          <p style={{ marginBottom: '8px' }}>💡 测试账号：</p>
          <p style={{ margin: '4px 0' }}>admin / 123456 (超级管理员)</p>
          <p style={{ margin: '4px 0' }}>teacher1 / 123456 (教师)</p>
          <p style={{ margin: '4px 0' }}>student1 / 123456 (学生)</p>
        </div>
      </div>
    </div>
  )
}

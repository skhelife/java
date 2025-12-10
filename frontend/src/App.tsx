import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import FloatingBackground from './components/FloatingBackground'
import {
    Home, ClassDistribution, StudentSearch, Rankings, Stats,
    StudentManagement, GradeEntry, Login, UserManagement,
    RoleManagement, AuditLog
} from './pages'
import GradeList from './pages/GradeList'

export default function App() {
    return (
        <>
            <FloatingBackground />
            <div className="app">
                <aside className="sidebar">
                    <div className="logo">🎓 成绩管家</div>
                    <nav>
                        <NavLink to="/" end>📊 系统概览</NavLink>
                        <NavLink to="/distribution">📈 班级分布</NavLink>
                        <NavLink to="/search">🔍 学生查询</NavLink>
                        <NavLink to="/rankings">🏆 排行榜</NavLink>
                        <NavLink to="/stats">📉 统计分析</NavLink>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }}></div>
                        <NavLink to="/management">👥 学生管理</NavLink>
                        <NavLink to="/grade-list">📊 成绩列表</NavLink>
                        <NavLink to="/grades">📝 成绩录入</NavLink>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }}></div>
                        <NavLink to="/users">🔐 用户管理</NavLink>
                        <NavLink to="/roles">🛡️ 角色管理</NavLink>
                        <NavLink to="/logs">📝 审计日志</NavLink>
                    </nav>
                    <div className="theme-toggle">🌙 深色模式</div>
                </aside>
                <main className="main">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/distribution" element={<ClassDistribution />} />
                        <Route path="/search" element={<StudentSearch />} />
                        <Route path="/rankings" element={<Rankings />} />
                        <Route path="/stats" element={<Stats />} />
                        <Route path="/management" element={<StudentManagement />} />
                        <Route path="/grade-list" element={<GradeList />} />
                        <Route path="/grades" element={<GradeEntry />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/roles" element={<RoleManagement />} />
                        <Route path="/logs" element={<AuditLog />} />
                    </Routes>
                </main>
            </div>
        </>
    )
}

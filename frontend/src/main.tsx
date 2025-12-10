import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import { initializeMockData } from './services/mockDataInit'
import { debugMockData } from './services/debugData'

// 检查是否需要强制重置数据（开发模式）
const DEV_MODE = import.meta.env.DEV
const FORCE_RESET = true // 设置为true强制重置数据

if (DEV_MODE) {
    console.log('%c🚀 学生成绩管理系统 - 开发模式', 'color: #6ee7b7; font-size: 16px; font-weight: bold')

    if (FORCE_RESET) {
        console.log('%c⚠️ 强制重置数据模式', 'color: #f59e0b; font-size: 14px')
        localStorage.removeItem('mockData')
    }
}

// 初始化Mock数据
initializeMockData()

// 开发模式下自动运行诊断
if (DEV_MODE) {
    setTimeout(() => {
        console.log('%c📊 数据诊断报告', 'color: #3b82f6; font-size: 14px; font-weight: bold')
        debugMockData()
    }, 1000)
}

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
)

import React from 'react'
import FloatingBackground from '../components/FloatingBackground'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ position: 'relative', zIndex: 1 }}>
            <FloatingBackground />
            {children}
        </div>
    )
}

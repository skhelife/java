import React from 'react'

export default function FloatingBackground() {
    return (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', width: 600, height: 600, left: -100, top: -100, background: 'radial-gradient(circle,#6ee7b7,transparent)', filter: 'blur(120px)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', width: 500, height: 500, right: -80, bottom: -80, background: 'radial-gradient(circle,#7c3aed,transparent)', filter: 'blur(100px)', opacity: 0.5 }} />
        </div>
    )
}

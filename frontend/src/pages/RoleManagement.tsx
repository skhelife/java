import React, { useState, useEffect } from 'react'
import { mockApi } from '../services/mockApi'

export default function RoleManagement() {
  const [roles, setRoles] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [formData, setFormData] = useState({
    roleName: '',
    roleCode: '',
    description: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [rolesRes, permsRes] = await Promise.all([
        mockApi.getRoles(),
        mockApi.getPermissions()
      ])
      setRoles(rolesRes.data || rolesRes || [])
      setPermissions(permsRes.data || permsRes || [])
    } catch (error) {
      console.error('加载数据失败:', error)
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingRole(null)
    setFormData({
      roleName: '',
      roleCode: '',
      description: '',
      status: 'ACTIVE'
    })
    setShowModal(true)
  }

  const handleEdit = (role: any) => {
    setEditingRole(role)
    setFormData({
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description || '',
      status: role.status || 'ACTIVE'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRole) {
        await mockApi.updateRole(editingRole.id, formData)
      } else {
        await mockApi.createRole(formData)
      }
      setShowModal(false)
      loadData()
    } catch (error) {
      alert('操作失败: ' + error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个角色吗？')) return
    try {
      await mockApi.deleteRole(id)
      loadData()
    } catch (error) {
      alert('删除失败: ' + error)
    }
  }

  const handleManagePermissions = async (role: any) => {
    setSelectedRole(role)
    try {
      const rolePermsRes = await mockApi.getRolePermissions(role.id)
      const rolePerms = rolePermsRes.data || rolePermsRes || []
      setSelectedPermissions(rolePerms.map((p: any) => p.id))
      setShowPermissionModal(true)
    } catch (error) {
      console.error('加载权限失败:', error)
    }
  }

  const handleSavePermissions = async () => {
    if (!selectedRole) return
    try {
      await mockApi.assignPermissions(selectedRole.id, selectedPermissions)
      setShowPermissionModal(false)
      alert('权限分配成功！')
    } catch (error) {
      alert('保存失败: ' + error)
    }
  }

  const togglePermission = (permId: number) => {
    setSelectedPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    )
  }

  // 按资源类型分组权限
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const type = perm.resourceType || '其他'
    if (!acc[type]) acc[type] = []
    acc[type].push(perm)
    return acc
  }, {} as Record<string, any[]>)

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '1.25rem'
      }}>
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          角色管理
        </h1>
        <button
          onClick={handleCreate}
          style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)'
          }}
        >
          ➕ 添加角色
        </button>
      </div>

      {/* 角色列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {roles.map(role => (
          <div key={role.id} style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            transition: 'all 0.3s'
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 12px 40px 0 rgba(31, 38, 135, 0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '0.25rem'
                }}>{role.roleName}</h3>
                <p style={{
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.6)'
                }}>{role.roleCode}</p>
              </div>
              <span style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.75rem',
                borderRadius: '0.25rem',
                background: role.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: role.status === 'ACTIVE' ? 'rgba(134, 239, 172, 1)' : 'rgba(252, 165, 165, 1)',
                border: role.status === 'ACTIVE' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                {role.status === 'ACTIVE' ? '激活' : '禁用'}
              </span>
            </div>
            <p style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>{role.description}</p>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                {role.isSystemRole && (
                  <span style={{ color: 'rgba(251, 146, 60, 1)' }}>🔒 系统角色</span>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.25rem' }}>
                权限数量: {role.permissionCount || 0}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleManagePermissions(role)}
                style={{
                  flex: 1,
                  padding: '0.5rem 0.75rem',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.3s',
                  fontWeight: '500'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                权限管理
              </button>
              {!role.isSystemRole && (
                <>
                  <button
                    onClick={() => handleEdit(role)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(59, 130, 246, 0.8)',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)'}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: 'rgba(239, 68, 68, 0.8)',
                      color: 'white',
                      borderRadius: '0.5rem',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
                  >
                    删除
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 编辑/新建模态框 */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '28rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {editingRole ? '编辑角色' : '新建角色'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#374151'
                  }}>角色名称</label>
                  <input
                    type="text"
                    value={formData.roleName}
                    onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#374151'
                  }}>角色代码</label>
                  <input
                    type="text"
                    value={formData.roleCode}
                    onChange={e => setFormData({ ...formData, roleCode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    required
                    disabled={!!editingRole}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#374151'
                  }}>描述</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s',
                      minHeight: '80px'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    rows={3}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#374151'
                  }}>状态</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <option value="ACTIVE">激活</option>
                    <option value="INACTIVE">禁用</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.5rem 1rem',
                    border: '1px solid rgba(209, 213, 219, 1)',
                    borderRadius: '0.5rem',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(243, 244, 246, 1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  取消
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)'
                  }}
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 权限管理模态框 */}
      {showPermissionModal && selectedRole && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            width: '100%',
            maxWidth: '56rem',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              为 "{selectedRole.roleName}" 分配权限
            </h2>
            <div style={{
              marginBottom: '1rem',
              fontSize: '0.875rem',
              color: '#4B5563',
              padding: '0.5rem',
              background: 'rgba(168, 85, 247, 0.1)',
              borderRadius: '0.5rem'
            }}>
              已选择 {selectedPermissions.length} 项权限
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {Object.entries(groupedPermissions).map(([type, perms]: [string, any]) => (
                <div key={type} style={{
                  border: '1px solid rgba(209, 213, 219, 1)',
                  borderRadius: '0.5rem',
                  padding: '1rem'
                }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    marginBottom: '0.75rem',
                    fontSize: '1.125rem',
                    color: '#1F2937'
                  }}>{type}</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '0.5rem'
                  }}>
                    {perms.map((perm: any) => (
                      <label key={perm.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        transition: 'background 0.2s'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(243, 244, 246, 1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '500', fontSize: '0.875rem', color: '#1F2937' }}>
                            {perm.permissionName}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                            {perm.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                onClick={() => setShowPermissionModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid rgba(209, 213, 219, 1)',
                  borderRadius: '0.5rem',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(243, 244, 246, 1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                取消
              </button>
              <button
                onClick={handleSavePermissions}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(168, 85, 247, 0.6)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(168, 85, 247, 0.4)'
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

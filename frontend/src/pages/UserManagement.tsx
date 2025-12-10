import React, { useState, useEffect } from 'react'
import { mockApi } from '../services/mockApi'

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    loadData()
  }, [page])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, rolesRes] = await Promise.all([
        mockApi.getUsers(page, 20),
        mockApi.getRoles()
      ])

      // mockApi 返回 { success, data: paginate(...) }
      const usersPage = usersRes.data || usersRes
      setUsers(usersPage.content || [])
      setTotal(usersPage.totalElements || 0)

      // rolesRes 也可能是 { success, data: [...] }
      setRoles(rolesRes.data || rolesRes || [])
    } catch (error) {
      console.error('加载数据失败:', error)
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      username: '',
      password: '',
      email: '',
      fullName: '',
      status: 'ACTIVE'
    })
    setShowModal(true)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: '',
      email: user.email || '',
      fullName: user.fullName || '',
      status: user.status || 'ACTIVE'
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await mockApi.updateUser(editingUser.id, formData)
      } else {
        await mockApi.createUser(formData)
      }
      setShowModal(false)
      loadData()
    } catch (error) {
      alert('操作失败: ' + error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个用户吗？')) return
    try {
      await mockApi.deleteUser(id)
      loadData()
    } catch (error) {
      alert('删除失败: ' + error)
    }
  }

  const handleResetPassword = async (id: number) => {
    if (!confirm('确定要重置此用户密码吗？新密码将是: 123456')) return
    try {
      await mockApi.resetPassword(id)
      alert('密码已重置为: 123456')
    } catch (error) {
      alert('重置失败: ' + error)
    }
  }

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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          用户管理
        </h1>
        <button
          onClick={handleCreate}
          style={{
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '0.5rem',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
          }}
        >
          ➕ 添加用户
        </button>
      </div>

      {/* 用户列表 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{
            background: 'rgba(102, 126, 234, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <tr>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>ID</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>用户名</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>姓名</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>邮箱</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>角色</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>状态</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>最后登录</th>
              <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', textTransform: 'uppercase' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>{user.id}</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)' }}>{user.username}</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', color: 'rgba(255, 255, 255, 0.8)' }}>{user.fullName}</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>{user.email}</td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {user.roles?.map((role: any) => (
                      <span key={role.id} style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: 'rgba(147, 197, 253, 1)',
                        borderRadius: '0.25rem',
                        border: '1px solid rgba(59, 130, 246, 0.3)'
                      }}>
                        {role.roleName}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.75rem',
                    borderRadius: '0.25rem',
                    background: user.status === 'ACTIVE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: user.status === 'ACTIVE' ? 'rgba(134, 239, 172, 1)' : 'rgba(252, 165, 165, 1)',
                    border: user.status === 'ACTIVE' ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    {user.status === 'ACTIVE' ? '激活' : '禁用'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  {user.lastLoginTime ? new Date(user.lastLoginTime).toLocaleString() : '-'}
                </td>
                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      color: 'rgba(59, 130, 246, 1)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '0.75rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(96, 165, 250, 1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(59, 130, 246, 1)'}
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleResetPassword(user.id)}
                    style={{
                      color: 'rgba(234, 179, 8, 1)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginRight: '0.75rem',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(250, 204, 21, 1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(234, 179, 8, 1)'}
                  >
                    重置密码
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{
                      color: 'rgba(239, 68, 68, 1)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(248, 113, 113, 1)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(239, 68, 68, 1)'}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div style={{
        marginTop: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
          共 {total} 条记录
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              if (page !== 1) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            上一页
          </button>
          <span style={{
            padding: '0.5rem 1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center'
          }}>第 {page} 页</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * 20 >= total}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.9)',
              cursor: page * 20 >= total ? 'not-allowed' : 'pointer',
              opacity: page * 20 >= total ? 0.5 : 1,
              transition: 'all 0.3s'
            }}
            onMouseEnter={e => {
              if (page * 20 < total) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            下一页
          </button>
        </div>
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
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {editingUser ? '编辑用户' : '新建用户'}
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
                  }}>用户名</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    required
                    disabled={!!editingUser}
                  />
                </div>
                {!editingUser && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.25rem',
                      color: '#374151'
                    }}>密码</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        border: '1px solid rgba(209, 213, 219, 1)',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'all 0.3s'
                      }}
                      onFocus={e => {
                        e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 1)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                      }}
                      onBlur={e => {
                        e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      required
                    />
                  </div>
                )}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#374151'
                  }}>姓名</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.25rem',
                    color: '#374151'
                  }}>邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      border: '1px solid rgba(209, 213, 219, 1)',
                      borderRadius: '0.5rem',
                      outline: 'none',
                      transition: 'all 0.3s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = 'rgba(209, 213, 219, 1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
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
                      e.currentTarget.style.borderColor = 'rgba(102, 126, 234, 1)'
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
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
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

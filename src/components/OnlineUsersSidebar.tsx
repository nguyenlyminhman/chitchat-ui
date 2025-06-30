import React, { useState, useRef } from 'react'
import type { OnlineUser } from '@/app/chat/page'

interface OnlineUsersSidebarProps {
  onlineUsers: OnlineUser[]
  selectedUser: OnlineUser | null
  onUserSelect: (user: OnlineUser) => void
}

const OnlineUsersSidebar: React.FC<OnlineUsersSidebarProps> = ({ onlineUsers, selectedUser, onUserSelect }) => {
  const [filter, setFilter] = useState('')
  const filteredUsers = onlineUsers.filter(u => u.username.toLowerCase().includes(filter.toLowerCase()))


  return (
    <div className="border-end bg-white" style={{ width: '280px', minWidth: '280px', zIndex: 2, position: 'relative' }}>
      <div className="p-3 border-bottom">
        {/* <h6 className="mb-2 text-muted">Online Users</h6> */}
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder="Tìm kiếm..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
        {filteredUsers.map((onlineUser) => (
          <div
            key={onlineUser.id}
            className={`d-flex align-items-center p-3 border-bottom hover-bg-light ${selectedUser?.id === onlineUser.id ? 'bg-white' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onUserSelect(onlineUser)}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center me-3"
              style={{
                width: '40px',
                height: '40px',
                background: '#e3f2fd',
                color: '#1976d2',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {onlineUser.username[0].toUpperCase()}
            </div>
            <div>
              <div className="fw-medium d-flex align-items-center">
                {onlineUser.username}
                <span
                  className="rounded-circle ms-2"
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#4caf50',
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-muted py-4 small">Không tìm thấy người dùng</div>
        )}
      </div>
    </div>
  )
}

export default OnlineUsersSidebar 
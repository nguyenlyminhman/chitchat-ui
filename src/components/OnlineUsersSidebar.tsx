import React from 'react'
import type { OnlineUser } from '@/app/chat/page'

interface OnlineUsersSidebarProps {
  onlineUsers: OnlineUser[]
  selectedUser: OnlineUser | null
  onUserSelect: (user: OnlineUser) => void
}

const OnlineUsersSidebar: React.FC<OnlineUsersSidebarProps> = ({ onlineUsers, selectedUser, onUserSelect }) => (
  <div className="border-end bg-white" style={{ width: '280px', minWidth: '280px' }}>
    <div className="p-3 border-bottom">
      <h6 className="mb-0 text-muted">Online Users</h6>
    </div>
    <div className="overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
      {onlineUsers.map((onlineUser) => (
        <div
          key={onlineUser.id}
          className={`d-flex align-items-center p-3 border-bottom hover-bg-light ${
            selectedUser?.id === onlineUser.id ? 'bg-light' : ''
          }`}
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
    </div>
  </div>
)

export default OnlineUsersSidebar 
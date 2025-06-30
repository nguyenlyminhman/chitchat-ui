import React from 'react'
import { Button } from 'react-bootstrap'
import type { OnlineUser } from '@/app/chat/page'

interface ChatHeaderProps {
  selectedUser: OnlineUser
  showRightDrawer: boolean
  setShowRightDrawer: (show: boolean) => void
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser, showRightDrawer, setShowRightDrawer }) => (
  <div className="d-flex align-items-center justify-content-between p-3 bg-white rounded-3 mb-3 shadow-sm">
    <div className="d-flex align-items-center">
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
        {selectedUser.username[0].toUpperCase()}
      </div>
      <div>
        <div className="fw-medium d-flex align-items-center">
          {selectedUser.username}
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
    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => setShowRightDrawer(!showRightDrawer)}
    >
      {showRightDrawer ? '✕' : '☰'}
    </Button>
  </div>
)

export default ChatHeader 
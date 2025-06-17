'use client'

import { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Card, Navbar, Nav } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
}

interface OnlineUser {
  id: string
  username: string
  lastSeen: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([
    { id: '1', username: 'John Doe', lastSeen: new Date() },
    { id: '2', username: 'Jane Smith', lastSeen: new Date() },
    { id: '3', username: 'Mike Johnson', lastSeen: new Date() },
    { id: '4', username: 'Sarah Williams', lastSeen: new Date() },
  ])
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null)
  const { user, logout } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: user?.username || 'Anonymous',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleUserSelect = (user: OnlineUser) => {
    setSelectedUser(user)
    setMessages([])
  }

  return (
    <div className="d-flex flex-column vh-100" style={{ background: '#f0f2f5' }}>
      <Navbar bg="white" variant="light" className="px-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-primary">ChitChat</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-primary" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Online Users Sidebar */}
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
                onClick={() => handleUserSelect(onlineUser)}
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

        {/* Chat Area */}
        <Container fluid className="flex-grow-1 d-flex flex-column py-3">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="d-flex align-items-center p-3 bg-white rounded-3 mb-3 shadow-sm">
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

              <div className="flex-grow-1 overflow-auto mb-3 px-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`d-flex mb-2 ${
                      message.sender === user?.username ? 'justify-content-end' : 'justify-content-start'
                    }`}
                  >
                    <div
                      className={`d-flex align-items-end ${
                        message.sender === user?.username ? 'flex-row-reverse' : 'flex-row'
                      }`}
                      style={{ maxWidth: '70%' }}
                    >
                      <div 
                        className={`rounded-circle d-flex align-items-center justify-content-center ${
                          message.sender === user?.username ? 'ms-2' : 'me-2'
                        }`}
                        style={{ 
                          width: '28px', 
                          height: '28px',
                          background: message.sender === user?.username ? '#e3f2fd' : '#bbdefb',
                          color: message.sender === user?.username ? '#1976d2' : '#1565c0',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {message.sender[0].toUpperCase()}
                      </div>
                      <div>
                        <div
                          className={`rounded-3 px-3 py-2 ${
                            message.sender === user?.username
                              ? 'bg-primary text-white'
                              : 'bg-white'
                          }`}
                          style={{ 
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            fontSize: '0.95rem',
                            lineHeight: '1.4'
                          }}
                        >
                          {message.content}
                        </div>
                        <small 
                          className={`d-block mt-1 ${
                            message.sender === user?.username ? 'text-end' : 'text-start'
                          }`}
                          style={{ 
                            fontSize: '0.75rem',
                            color: '#666'
                          }}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <Card className="border-0 shadow-sm">
                <Card.Body className="p-2">
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSendMessage()
                    }}
                  >
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="border-0 shadow-none"
                      />
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4"
                      >
                        Send
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center text-muted">
                <h5>Select a user to start chatting</h5>
                <p className="mb-0">Choose from the list of online users</p>
              </div>
            </div>
          )}
        </Container>
      </div>
    </div>
  )
} 
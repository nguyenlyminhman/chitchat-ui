'use client'

import { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Card, Navbar, Nav, Image, Modal, Carousel } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'multiple'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  files?: Array<{
    url: string
    name: string
    size: number
    type: string
  }>
}

interface OnlineUser {
  id: string
  username: string
  lastSeen: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFileData, setSelectedFileData] = useState<{ name: string; size: number; url: string } | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([
    { id: '1', username: 'John Doe', lastSeen: new Date() },
    { id: '2', username: 'Jane Smith', lastSeen: new Date() },
    { id: '3', username: 'Mike Johnson', lastSeen: new Date() },
    { id: '4', username: 'Sarah Williams', lastSeen: new Date() },
  ])
  const [selectedUser, setSelectedUser] = useState<OnlineUser | null>(null)
  const [showRightDrawer, setShowRightDrawer] = useState(false)
  const [activeTab, setActiveTab] = useState('images')
  const { user, logout } = useAuth()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedUser) return

    let message: Message

    if (selectedFiles.length > 0) {
      if (selectedFiles.length === 1) {
        // Single file
        const file = selectedFiles[0]
        const isImage = file.type.startsWith('image/')
        message = {
          id: Date.now().toString(),
          content: newMessage || (isImage ? 'Sent an image' : 'Sent a file'),
          sender: user?.username || 'Anonymous',
          timestamp: new Date(),
          type: isImage ? 'image' : 'file',
          fileUrl: URL.createObjectURL(file),
          fileName: file.name,
          fileSize: file.size,
        }
      } else {
        // Multiple files
        const files = selectedFiles.map(file => ({
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
        }))
        message = {
          id: Date.now().toString(),
          content: newMessage || `Sent ${selectedFiles.length} files`,
          sender: user?.username || 'Anonymous',
          timestamp: new Date(),
          type: 'multiple',
          files: files,
        }
      }
      setSelectedFiles([])
    } else {
      // Text message
      message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: user?.username || 'Anonymous',
        timestamp: new Date(),
        type: 'text',
      }
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files])
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleImageClick = (imageUrl: string, allImages?: string[]) => {
    if (allImages) {
      setSelectedImages(allImages)
      setCurrentImageIndex(allImages.indexOf(imageUrl))
    } else {
      setSelectedImages([imageUrl])
      setCurrentImageIndex(0)
    }
    setShowImageModal(true)
  }

  const handleFileClick = (fileData: { name: string; size: number; url: string }) => {
    setSelectedFileData(fileData)
    setShowFileModal(true)
  }

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCarouselSelect = (selectedIndex: number) => {
    setCurrentImageIndex(selectedIndex)
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

              <div className="d-flex flex-grow-1">
                {/* Main Chat Content */}
                <div className={`flex-grow-1 d-flex flex-column ${showRightDrawer ? 'me-3' : ''}`}>
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
                              {message.type === 'image' && message.fileUrl && (
                                <div className="mb-2">
                                  <Image
                                    src={message.fileUrl}
                                    alt="Shared image"
                                    fluid
                                    className="rounded"
                                    style={{ 
                                      maxWidth: '200px', 
                                      maxHeight: '200px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => handleImageClick(message.fileUrl!)}
                                  />
                                </div>
                              )}
                              {message.type === 'file' && message.fileName && message.fileUrl && (
                                <div 
                                  className="mb-2 p-2 bg-light rounded"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => handleFileClick({
                                    name: message.fileName!,
                                    size: message.fileSize!,
                                    url: message.fileUrl!
                                  })}
                                >
                                  <div className="fw-medium">{message.fileName}</div>
                                  <small className="text-muted">
                                    {message.fileSize && formatFileSize(message.fileSize)}
                                  </small>
                                </div>
                              )}
                              {message.type === 'multiple' && message.files && (
                                <div className="mb-2">
                                  <div className="row g-2">
                                    {message.files.map((file, index) => (
                                      <div key={index} className="col-6 col-md-4">
                                        {file.type.startsWith('image/') ? (
                                          <Image
                                            src={file.url}
                                            alt={file.name}
                                            fluid
                                            className="rounded"
                                            style={{ 
                                              maxHeight: '120px',
                                              cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                              const imageUrls = message.files!
                                                .filter(f => f.type.startsWith('image/'))
                                                .map(f => f.url)
                                              handleImageClick(file.url, imageUrls)
                                            }}
                                          />
                                        ) : (
                                          <div 
                                            className="p-2 bg-light rounded"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleFileClick({
                                              name: file.name,
                                              size: file.size,
                                              url: file.url
                                            })}
                                          >
                                            <div className="fw-medium small">{file.name}</div>
                                            <small className="text-muted">{formatFileSize(file.size)}</small>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
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

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <Card className="mb-3 border-0 shadow-sm">
                      <Card.Body className="p-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">{selectedFiles.length} file(s) selected</small>
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => {
                              setSelectedFiles([])
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                              }
                            }}
                          >
                            Clear all
                          </Button>
                        </div>
                        <div className="row g-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="col-6 col-md-4">
                              <div className="d-flex align-items-center p-2 bg-light rounded">
                                <div className="me-2">
                                  {file.type.startsWith('image/') ? (
                                    <Image
                                      src={URL.createObjectURL(file)}
                                      alt="Preview"
                                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                      className="rounded"
                                    />
                                  ) : (
                                    <div
                                      className="d-flex align-items-center justify-content-center rounded"
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        background: '#e3f2fd',
                                        color: '#1976d2',
                                      }}
                                    >
                                      📄
                                    </div>
                                  )}
                                </div>
                                <div className="flex-grow-1">
                                  <div className="fw-medium small">{file.name}</div>
                                  <small className="text-muted">{formatFileSize(file.size)}</small>
                                </div>
                                <Button
                                  variant="link"
                                  className="text-danger p-0"
                                  onClick={() => removeSelectedFile(index)}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  )}

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
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="d-none"
                            onChange={handleFileSelect}
                            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                            multiple
                          />
                          <Button
                            variant="outline-secondary"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3"
                          >
                            📎
                          </Button>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={!newMessage.trim() && selectedFiles.length === 0}
                            className="px-4"
                          >
                            Send
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </div>

                {/* Right Drawer */}
                {showRightDrawer && (
                  <div className="bg-white rounded-3 shadow-sm" style={{ width: '300px', minWidth: '300px' }}>
                    <div className="p-3 border-bottom">
                      <h6 className="mb-0">Chat Details</h6>
                    </div>
                    
                    {/* Tabs */}
                    <Nav variant="tabs" className="px-3 pt-2">
                      <Nav.Item>
                        <Nav.Link 
                          active={activeTab === 'images'} 
                          onClick={() => setActiveTab('images')}
                          className="py-2"
                        >
                          Hình ảnh
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          active={activeTab === 'files'} 
                          onClick={() => setActiveTab('files')}
                          className="py-2"
                        >
                          Tệp
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link 
                          active={activeTab === 'links'} 
                          onClick={() => setActiveTab('links')}
                          className="py-2"
                        >
                          Link
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>

                    {/* Tab Content */}
                    <div className="p-3" style={{ height: 'calc(100vh - 280px)', overflow: 'auto' }}>
                      {activeTab === 'images' && (
                        <div>
                          <h6 className="mb-3">Hình ảnh đã chia sẻ</h6>
                          <div className="text-muted small mb-3">
                            {messages.filter(m => m.type === 'image' || (m.type === 'multiple' && m.files?.some(f => f.type.startsWith('image/')))).length} hình ảnh
                          </div>
                          <div className="row g-2">
                            {messages
                              .filter(m => m.type === 'image' || (m.type === 'multiple' && m.files?.some(f => f.type.startsWith('image/'))))
                              .map((message, index) => {
                                if (message.type === 'image' && message.fileUrl) {
                                  return (
                                    <div key={index} className="col-6">
                                      <Image
                                        src={message.fileUrl}
                                        alt="Shared image"
                                        fluid
                                        className="rounded"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleImageClick(message.fileUrl!)}
                                      />
                                    </div>
                                  )
                                } else if (message.type === 'multiple' && message.files) {
                                  return message.files
                                    .filter(f => f.type.startsWith('image/'))
                                    .map((file, fileIndex) => (
                                      <div key={`${index}-${fileIndex}`} className="col-6">
                                        <Image
                                          src={file.url}
                                          alt={file.name}
                                          fluid
                                          className="rounded"
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => {
                                            const imageUrls = message.files!
                                              .filter(f => f.type.startsWith('image/'))
                                              .map(f => f.url)
                                            handleImageClick(file.url, imageUrls)
                                          }}
                                        />
                                      </div>
                                    ))
                                }
                                return null
                              })}
                          </div>
                        </div>
                      )}

                      {activeTab === 'files' && (
                        <div>
                          <h6 className="mb-3">Tệp đã chia sẻ</h6>
                          <div className="text-muted small mb-3">
                            {messages.filter(m => m.type === 'file' || (m.type === 'multiple' && m.files?.some(f => !f.type.startsWith('image/')))).length} tệp
                          </div>
                          <div>
                            {messages
                              .filter(m => m.type === 'file' || (m.type === 'multiple' && m.files?.some(f => !f.type.startsWith('image/'))))
                              .map((message, index) => {
                                if (message.type === 'file' && message.fileName && message.fileUrl) {
                                  return (
                                    <div key={index} className="mb-2 p-2 bg-light rounded">
                                      <div className="d-flex align-items-center">
                                        <div className="me-2">📄</div>
                                        <div className="flex-grow-1">
                                          <div className="fw-medium small">{message.fileName}</div>
                                          <small className="text-muted">
                                            {message.fileSize && formatFileSize(message.fileSize)}
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                } else if (message.type === 'multiple' && message.files) {
                                  return message.files
                                    .filter(f => !f.type.startsWith('image/'))
                                    .map((file, fileIndex) => (
                                      <div key={`${index}-${fileIndex}`} className="mb-2 p-2 bg-light rounded">
                                        <div className="d-flex align-items-center">
                                          <div className="me-2">📄</div>
                                          <div className="flex-grow-1">
                                            <div className="fw-medium small">{file.name}</div>
                                            <small className="text-muted">{formatFileSize(file.size)}</small>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                }
                                return null
                              })}
                          </div>
                        </div>
                      )}

                      {activeTab === 'links' && (
                        <div>
                          <h6 className="mb-3">Liên kết đã chia sẻ</h6>
                          <div className="text-muted small">
                            Chưa có liên kết nào được chia sẻ
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
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

      {/* Image Modal with Carousel */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Image View {selectedImages.length > 1 && `(${currentImageIndex + 1}/${selectedImages.length})`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-0">
          {selectedImages.length > 1 ? (
            <Carousel
              activeIndex={currentImageIndex}
              onSelect={handleCarouselSelect}
              interval={null}
              indicators={false}
              controls={true}
            >
              {selectedImages.map((imageUrl, index) => (
                <Carousel.Item key={index}>
                  <Image
                    src={imageUrl}
                    alt={`Image ${index + 1}`}
                    fluid
                    className="rounded"
                    style={{ maxHeight: '70vh' }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Image
              src={selectedImages[0]}
              alt="Full size image"
              fluid
              className="rounded"
              style={{ maxHeight: '70vh' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              downloadFile(selectedImages[currentImageIndex], `image_${currentImageIndex + 1}.jpg`)
              setShowImageModal(false)
            }}
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>

      {/* File Modal */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>File Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFileData && (
            <div className="text-center">
              <div className="mb-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: '#e3f2fd',
                    color: '#1976d2',
                    fontSize: '2rem',
                  }}
                >
                  📄
                </div>
                <h5>{selectedFileData.name}</h5>
                <p className="text-muted mb-0">{formatFileSize(selectedFileData.size)}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFileModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              if (selectedFileData) {
                downloadFile(selectedFileData.url, selectedFileData.name)
                setShowFileModal(false)
              }
            }}
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
} 
'use client'

import { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Card, Navbar, Nav, Image, Modal, Carousel } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import OnlineUsersSidebar from '@/components/OnlineUsersSidebar'
import ChatHeader from '@/components/ChatHeader'
import ChatMessages from '@/components/ChatMessages'
import ChatRightDrawer from '@/components/ChatRightDrawer'
import ImageModalCarousel from '@/components/ImageModalCarousel'
import FileModal from '@/components/FileModal'

export interface Message {
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

export interface OnlineUser {
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
        <OnlineUsersSidebar 
          onlineUsers={onlineUsers} 
          selectedUser={selectedUser} 
          onUserSelect={handleUserSelect} 
        />
        {/* Chat Area */}
        <Container fluid className="flex-grow-1 d-flex flex-column py-3">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <ChatHeader 
                selectedUser={selectedUser} 
                showRightDrawer={showRightDrawer} 
                setShowRightDrawer={setShowRightDrawer} 
              />
              <div className="d-flex flex-grow-1">
                {/* Main Chat Content */}
                <div className={`flex-grow-1 d-flex flex-column ${showRightDrawer ? 'me-3' : ''}`}> 
                  <ChatMessages
                    messages={messages}
                    user={user}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    fileInputRef={fileInputRef}
                    handleSendMessage={handleSendMessage}
                    handleKeyPress={handleKeyPress}
                    handleFileSelect={handleFileSelect}
                    removeSelectedFile={removeSelectedFile}
                    formatFileSize={formatFileSize}
                    handleImageClick={handleImageClick}
                    handleFileClick={handleFileClick}
                  />
                </div>
                {/* Right Drawer */}
                <ChatRightDrawer
                  show={showRightDrawer}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  messages={messages}
                  handleImageClick={handleImageClick}
                  formatFileSize={formatFileSize}
                />
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
      <ImageModalCarousel
        show={showImageModal}
        images={selectedImages}
        currentIndex={currentImageIndex}
        onHide={() => setShowImageModal(false)}
        onSelect={handleCarouselSelect}
        onDownload={downloadFile}
      />
      {/* File Modal */}
      <FileModal
        show={showFileModal}
        fileData={selectedFileData}
        formatFileSize={formatFileSize}
        onHide={() => setShowFileModal(false)}
        onDownload={downloadFile}
      />
    </div>
  )
} 
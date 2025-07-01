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
import { Bell, PersonPlus, Inbox, EnvelopeOpen, Envelope, PeopleFill, PersonXFill, PersonCheckFill, Check2Circle, XCircle, Search } from 'react-bootstrap-icons'

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

export interface Notification {
  id: string
  content: string
  time: string
  read: boolean
  userId: string
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
  const [showNotificationList, setShowNotificationList] = useState(false)
  const [showFriendRequestList, setShowFriendRequestList] = useState(false)
  const [showSuggestList, setShowSuggestList] = useState(false)
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread' | 'read'>('all')
  const [notificationPage, setNotificationPage] = useState(1)
  const NOTIFICATIONS_PER_PAGE = 10
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', content: 'Tin nhắn mới từ John Doe', time: '2 phút trước', read: false, userId: '1' },
    { id: '2', content: 'Tin nhắn mới từ Jane Smith', time: '10 phút trước', read: true, userId: '2' },
    { id: '3', content: 'Tin nhắn mới từ Mike Johnson', time: '1 giờ trước', read: false, userId: '3' },
    // ... thêm nhiều thông báo mẫu để test scroll ...
    ...Array.from({ length: 25 }, (_, i) => ({
      id: (4 + i).toString(),
      content: `Thông báo mẫu ${i + 4}`,
      time: `${i + 4} phút trước`,
      read: i % 2 === 0,
      userId: ((i % 4) + 1).toString(),
    }))
  ])
  const notificationRef = useRef<HTMLDivElement>(null)
  const friendRequestRef = useRef<HTMLDivElement>(null)
  const suggestRef = useRef<HTMLDivElement>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState<Message[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationList(false)
      }
      if (friendRequestRef.current && !friendRequestRef.current.contains(event.target as Node)) {
        setShowFriendRequestList(false)
      }
      if (suggestRef.current && !suggestRef.current.contains(event.target as Node)) {
        setShowSuggestList(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false)
      }
    }
    if (showNotificationList || showFriendRequestList || showSuggestList || showSearch) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotificationList, showFriendRequestList, showSuggestList, showSearch])

  // Lọc thông báo theo tab
  const filteredNotifications = notifications.filter(n => {
    if (notificationTab === 'all') return true
    if (notificationTab === 'unread') return !n.read
    if (notificationTab === 'read') return n.read
    return true
  })
  // Phân trang
  const shownNotifications = filteredNotifications.slice(0, notificationPage * NOTIFICATIONS_PER_PAGE)
  // Xử lý scroll để load thêm
  const notificationListDiv = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!showNotificationList) return
    const handleScroll = () => {
      const div = notificationListDiv.current
      if (div && div.scrollTop + div.clientHeight >= div.scrollHeight - 10) {
        if (shownNotifications.length < filteredNotifications.length) {
          setNotificationPage(page => page + 1)
        }
      }
    }
    const div = notificationListDiv.current
    if (div) div.addEventListener('scroll', handleScroll)
    return () => { if (div) div.removeEventListener('scroll', handleScroll) }
  }, [showNotificationList, shownNotifications.length, filteredNotifications.length])
  // Reset page khi đổi tab
  useEffect(() => { setNotificationPage(1) }, [notificationTab, showNotificationList])

  // Click vào thông báo chưa đọc: đánh dấu đã đọc và chuyển đến user
  const handleNotificationClick = (n: Notification) => {
    if (!n.read) {
      setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
    }
    // Chuyển đến chat với user (giả lập)
    const user = onlineUsers.find(u => u.id === n.userId)
    if (user) setSelectedUser(user)
    setShowNotificationList(false)
  }

  // Friend request tabs and data
  const [friendTab, setFriendTab] = useState<'blocked'|'invited'|'received'>('blocked')
  const friendSuggestions = [
    { id: '1', name: 'Alice', mutual: 2 },
    { id: '2', name: 'Bob', mutual: 1 },
    { id: '3', name: 'Charlie', mutual: 0 },
    ...Array.from({ length: 20 }, (_, i) => ({
      id: (4 + i).toString(),
      name: `Friend Suggestion ${i + 4}`,
      mutual: i % 5,
    }))
  ]
  const friendBlocked = [
    { id: '4', name: 'Eve' },
    { id: '5', name: 'Mallory' },
    ...Array.from({ length: 12 }, (_, i) => ({
      id: (6 + i).toString(),
      name: `Blocked User ${i + 6}`
    }))
  ]
  const friendInvited = [
    { id: '6', name: 'Trent' },
    { id: '7', name: 'Oscar' },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: (8 + i).toString(),
      name: `Invited User ${i + 8}`
    }))
  ]
  const friendReceived = [
    { id: '100', name: 'User Request 1' },
    { id: '101', name: 'User Request 2' },
    { id: '102', name: 'User Request 3' },
    ...Array.from({ length: 8 }, (_, i) => ({
      id: (110 + i).toString(),
      name: `User Request ${i + 4}`
    }))
  ]

  useEffect(() => {
    if (searchText.trim() === '') {
      setSearchResults([])
      return
    }
    setSearchResults(
      messages.filter(m => m.content.toLowerCase().includes(searchText.toLowerCase()))
    )
  }, [searchText, messages])

  return (
    <div className="d-flex flex-column vh-100" style={{ background: '#f0f2f5' }}>
      <Navbar bg="white" variant="light" className="px-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-primary">ChitChat</Navbar.Brand>
          <Nav className="ms-auto align-items-center gap-3">
            {/* Notification Icon */}
            <div ref={notificationRef} style={{ position: 'relative', cursor: 'pointer' }}>
              <div title="Thông báo" onClick={() => { setShowNotificationList(v => !v); setShowFriendRequestList(false); setShowSuggestList(false) }}>
                <Bell size={22} />
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  background: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  fontWeight: 600,
                  lineHeight: 1
                }}>{notifications.filter(n => !n.read).length}</span>
              </div>
              {showNotificationList && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  minWidth: '340px',
                  background: 'white',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  borderRadius: 8,
                  zIndex: 1000,
                  maxHeight: '60vh',
                  overflow: 'hidden',
                }}>
                  <div className="border-bottom px-3 py-2 fw-bold">Thông báo</div>
                  {/* Tabs */}
                  <div className="d-flex border-bottom px-2 gap-2 pb-1 pt-2">
                    <button className={`btn btn-sm d-flex align-items-center gap-1 ${notificationTab==='all'?'btn-primary':'btn-light'}`} onClick={()=>setNotificationTab('all')}><Inbox size={16}/>Tất cả</button>
                    <button className={`btn btn-sm d-flex align-items-center gap-1 ${notificationTab==='unread'?'btn-primary':'btn-light'}`} onClick={()=>setNotificationTab('unread')}><Envelope size={16}/>Chưa đọc</button>
                    <button className={`btn btn-sm d-flex align-items-center gap-1 ${notificationTab==='read'?'btn-primary':'btn-light'}`} onClick={()=>setNotificationTab('read')}><EnvelopeOpen size={16}/>Đã đọc</button>
                  </div>
                  <div ref={notificationListDiv} className="notification-dropdown-scroll" style={{
                    maxHeight:'50vh',
                    overflowY:'auto',
                  }}>
                    {shownNotifications.length === 0 ? (
                      <div className="text-center text-muted py-4">Không có thông báo</div>
                    ) : shownNotifications.map(n => (
                      <div
                        key={n.id}
                        className={`px-3 py-2 d-flex align-items-center gap-2 ${!n.read ? 'bg-light' : ''}`}
                        style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                        onClick={()=>handleNotificationClick(n)}
                      >
                        {!n.read && <span style={{ width: 8, height: 8, background: '#4caf50', borderRadius: '50%', display: 'inline-block' }} />}
                        <div className="flex-grow-1">
                          <div style={{ fontWeight: !n.read ? 600 : 400 }}>{n.content}</div>
                          <div className="small text-muted">{n.time}</div>
                        </div>
                      </div>
                    ))}
                    {shownNotifications.length < filteredNotifications.length && (
                      <div className="text-center text-muted py-2 small">Đang tải thêm...</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Friend Suggestion Icon */}
            <div ref={suggestRef} style={{ position: 'relative', cursor: 'pointer' }}>
              <div title="Gợi ý kết bạn" onClick={() => { setShowSuggestList(v => !v); setShowNotificationList(false); setShowFriendRequestList(false) }}>
                <PeopleFill size={22} />
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  background: '#0d6efd',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  fontWeight: 600,
                  lineHeight: 1
                }}>{friendSuggestions.length}</span>
              </div>
              {showSuggestList && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  minWidth: '340px',
                  background: 'white',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  borderRadius: 8,
                  zIndex: 1000,
                  maxHeight: '60vh',
                  overflow: 'hidden',
                }}>
                  <div className="border-bottom px-3 py-2 fw-bold">Gợi ý kết bạn</div>
                  <div className="notification-dropdown-scroll" style={{maxHeight:'50vh',overflowY:'auto'}}>
                    {friendSuggestions.length === 0 ? <div className="text-center text-muted py-4">Không có gợi ý</div> :
                      friendSuggestions.map(f => (
                        <div key={f.id} className="px-3 py-2 d-flex align-items-center gap-2 border-bottom">
                          <PeopleFill size={20} className="text-primary"/>
                          <div className="flex-grow-1">
                            <div className="fw-bold">{f.name}</div>
                            <div className="small text-muted">{f.mutual} bạn chung</div>
                          </div>
                          <button className="btn btn-sm btn-outline-primary">Kết bạn</button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
            {/* Friend Request Icon (now Friend Management) */}
            <div ref={friendRequestRef} style={{ position: 'relative', cursor: 'pointer' }}>
              <div title="Quản lý bạn bè" onClick={() => { setShowFriendRequestList(v => !v); setShowNotificationList(false); setShowSuggestList(false) }}>
                <PersonPlus size={22} />
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  background: '#ffc107',
                  color: '#212529',
                  borderRadius: '50%',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  fontWeight: 600,
                  lineHeight: 1
                }}>{friendInvited.length + friendBlocked.length}</span>
              </div>
              {showFriendRequestList && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  minWidth: '340px',
                  background: 'white',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  borderRadius: 8,
                  zIndex: 1000,
                  maxHeight: '60vh',
                  overflow: 'hidden',
                }}>
                  <div className="border-bottom px-3 py-2 fw-bold">Quản lý bạn bè</div>
                  {/* Tabs */}
                  <div className="d-flex border-bottom px-2 gap-2 pb-1 pt-2">
                    <button className={`btn btn-sm d-flex align-items-center gap-1 ${friendTab==='blocked'?'btn-primary':'btn-light'}`} onClick={()=>setFriendTab('blocked')}><PersonXFill size={16}/>Đã chặn</button>
                    <button className={`btn btn-sm d-flex align-items-center gap-1 ${friendTab==='invited'?'btn-primary':'btn-light'}`} onClick={()=>setFriendTab('invited')}><PersonCheckFill size={16}/>Đã mời</button>
                    <button className={`btn btn-sm d-flex align-items-center gap-1 ${friendTab==='received'?'btn-primary':'btn-light'}`} onClick={()=>setFriendTab('received')}><Inbox size={16}/>Lời mời</button>
                  </div>
                  <div className="notification-dropdown-scroll" style={{maxHeight:'50vh',overflowY:'auto'}}>
                    {friendTab==='blocked' && (
                      friendBlocked.length === 0 ? <div className="text-center text-muted py-4">Không có ai bị chặn</div> :
                      friendBlocked.map(f => (
                        <div key={f.id} className="px-3 py-2 d-flex align-items-center gap-2 border-bottom">
                          <PersonXFill size={20} className="text-danger"/>
                          <div className="flex-grow-1">
                            <div className="fw-bold">{f.name}</div>
                          </div>
                          <button className="btn btn-sm btn-outline-secondary">Bỏ chặn</button>
                        </div>
                      ))
                    )}
                    {friendTab==='invited' && (
                      friendInvited.length === 0 ? <div className="text-center text-muted py-4">Chưa gửi lời mời nào</div> :
                      friendInvited.map(f => (
                        <div key={f.id} className="px-3 py-2 d-flex align-items-center gap-2 border-bottom">
                          <PersonCheckFill size={20} className="text-success"/>
                          <div className="flex-grow-1">
                            <div className="fw-bold">{f.name}</div>
                          </div>
                          <button className="btn btn-sm btn-outline-secondary">Thu hồi</button>
                        </div>
                      ))
                    )}
                    {friendTab==='received' && (
                      friendReceived.length === 0 ? <div className="text-center text-muted py-4">Không có lời mời nào</div> :
                      friendReceived.map(f => (
                        <div key={f.id} className="px-3 py-2 d-flex align-items-center gap-2 border-bottom">
                          <Inbox size={20} className="text-warning"/>
                          <div className="flex-grow-1">
                            <div className="fw-bold">{f.name}</div>
                          </div>
                          <Check2Circle size={24} className="text-success me-2" style={{cursor:'pointer'}} title="Chấp nhận" />
                          <XCircle size={24} className="text-danger" style={{cursor:'pointer'}} title="Từ chối" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Search Icon */}
            <div ref={searchRef} style={{ position: 'relative', cursor: 'pointer' }}>
              <div title="Tìm kiếm tin nhắn" onClick={() => { setShowSearch(v => !v); setShowNotificationList(false); setShowFriendRequestList(false); setShowSuggestList(false) }}>
                <Search size={22} />
              </div>
              {showSearch && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  minWidth: '340px',
                  background: 'white',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                  borderRadius: 8,
                  zIndex: 1000,
                  maxHeight: '60vh',
                  overflow: 'hidden',
                }}>
                  <div className="border-bottom px-3 py-2 fw-bold">Tìm kiếm tin nhắn</div>
                  <div className="p-2 border-bottom">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập nội dung tin nhắn..."
                      value={searchText}
                      onChange={e => setSearchText(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <div className="notification-dropdown-scroll" style={{maxHeight:'40vh',overflowY:'auto'}}>
                    {searchText.trim() === '' ? (
                      <div className="text-center text-muted py-4">Nhập từ khóa để tìm kiếm</div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center text-muted py-4">Không tìm thấy tin nhắn phù hợp</div>
                    ) : searchResults.map(m => (
                      <div key={m.id} className="px-3 py-2 border-bottom">
                        <div className="fw-bold">{m.sender}</div>
                        <div>{m.content}</div>
                        <div className="small text-muted">{m.timestamp.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
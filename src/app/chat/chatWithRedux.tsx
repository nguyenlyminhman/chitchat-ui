'use client'

import { useState, useEffect, useRef } from 'react'
import { Container, Form, Button, Card, Navbar, Nav, Image, Modal, Carousel } from 'react-bootstrap'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { 
  setSelectedUser, 
  addMessage, 
  setMessages,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser 
} from '@/store/slices/chatSlice'
import { 
  addNotification, 
  markAsRead,
  markAllAsRead 
} from '@/store/slices/notificationSlice'
import { 
  addSuggestion, 
  removeSuggestion,
  addBlockedUser,
  removeBlockedUser 
} from '@/store/slices/friendSlice'
import OnlineUsersSidebar from '@/components/OnlineUsersSidebar'
import ChatHeader from '@/components/ChatHeader'
import ChatMessages from '@/components/ChatMessages'
import ChatRightDrawer from '@/components/ChatRightDrawer'
import ImageModalCarousel from '@/components/ImageModalCarousel'
import FileModal from '@/components/FileModal'
import { Bell, PersonPlus, Inbox, EnvelopeOpen, Envelope, PeopleFill, PersonXFill, PersonCheckFill, Check2Circle, XCircle, Search } from 'react-bootstrap-icons'
import NotificationDropdown from '@/components/NotificationDropdown/NotificationDropdown'
import SuggestDropdown from '@/components/SuggestDropdown/SuggestDropdown'
import FriendDropdown from '@/components/FriendDropdown/FriendDropdown'
import SearchDropdown from '@/components/SearchDropdown/SearchDropdown'
import styles from './page.module.scss'

export default function ChatPageWithRedux() {
  const [newMessage, setNewMessage] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [showImageModal, setShowImageModal] = useState(false)
  const [showFileModal, setShowFileModal] = useState(false)
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedFileData, setSelectedFileData] = useState<{ name: string; size: number; url: string } | null>(null)
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
  const notificationRef = useRef<HTMLDivElement>(null)
  const friendRequestRef = useRef<HTMLDivElement>(null)
  const suggestRef = useRef<HTMLDivElement>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement>(null)

  // Redux hooks
  const dispatch = useAppDispatch()
  const { messages, selectedUser, onlineUsers } = useAppSelector((state) => state.chat)
  const { notifications } = useAppSelector((state) => state.notification)
  const { suggestions, blocked, invited, received } = useAppSelector((state) => state.friend)

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

    let message: any

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

    // Dispatch to Redux
    dispatch(addMessage(message))
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleUserSelect = (user: any) => {
    dispatch(setSelectedUser(user))
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
  const handleNotificationClick = (n: any) => {
    if (!n.read) {
      dispatch(markAsRead(n.id))
    }
    // Chuyển đến chat với user (giả lập)
    const user = onlineUsers.find(u => u.id === n.userId)
    if (user) dispatch(setSelectedUser(user))
    setShowNotificationList(false)
  }

  // Friend request tabs and data
  const [friendTab, setFriendTab] = useState<'blocked'|'invited'|'received'>('blocked')

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
    <div className={styles.mainWrapper}>
      <Navbar bg="white" variant="light" className="px-3 shadow-sm">
        <Container fluid>
          <Navbar.Brand className="fw-bold text-primary">ChitChat (Redux)</Navbar.Brand>
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
              <NotificationDropdown
                show={showNotificationList}
                notifications={notifications}
                notificationTab={notificationTab}
                setNotificationTab={(tab: 'all' | 'unread' | 'read') => setNotificationTab(tab)}
                shownNotifications={shownNotifications}
                filteredNotifications={filteredNotifications}
                notificationListDiv={notificationListDiv}
                handleNotificationClick={handleNotificationClick}
                onClose={() => setShowNotificationList(false)}
              />
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
                }}>{suggestions.length}</span>
              </div>
              <SuggestDropdown
                show={showSuggestList}
                friendSuggestions={suggestions}
                onClose={() => setShowSuggestList(false)}
              />
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
                }}>{invited.length + blocked.length}</span>
              </div>
              <FriendDropdown
                show={showFriendRequestList}
                friendTab={friendTab}
                setFriendTab={setFriendTab}
                friendBlocked={blocked}
                friendInvited={invited}
                friendReceived={received}
                onClose={() => setShowFriendRequestList(false)}
              />
            </div>
            {/* Search Icon */}
            <div ref={searchRef} style={{ position: 'relative', cursor: 'pointer' }}>
              <div title="Tìm kiếm tin nhắn" onClick={() => { setShowSearch(v => !v); setShowNotificationList(false); setShowFriendRequestList(false); setShowSuggestList(false) }}>
                <Search size={22} />
              </div>
              <SearchDropdown
                show={showSearch}
                searchText={searchText}
                setSearchText={setSearchText}
                searchResults={searchResults}
                onClose={() => setShowSearch(false)}
              />
            </div>
            <Button variant="outline-primary" onClick={logout}>
              Logout
            </Button>
          </Nav>
        </Container>
      </Navbar>

      <div className={`d-flex ${styles.flexGrow} ${styles.overflowHidden}`}>
        {/* Online Users Sidebar */}
        <OnlineUsersSidebar 
          onlineUsers={onlineUsers} 
          selectedUser={selectedUser} 
          onUserSelect={handleUserSelect} 
        />
        {/* Chat Area */}
        <Container fluid className={`flex-grow-1 d-flex flex-column py-3`}>
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
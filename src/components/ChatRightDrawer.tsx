import React from 'react'
import { Nav, Image } from 'react-bootstrap'
import type { Message } from '@/app/chat/page'

interface ChatRightDrawerProps {
  show: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  messages: Message[]
  handleImageClick: (imageUrl: string, allImages?: string[]) => void
  formatFileSize: (bytes: number) => string
}

const ChatRightDrawer: React.FC<ChatRightDrawerProps> = ({
  show,
  activeTab,
  setActiveTab,
  messages,
  handleImageClick,
  formatFileSize,
}) => {
  if (!show) return null
  return (
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
  )
}

export default ChatRightDrawer 
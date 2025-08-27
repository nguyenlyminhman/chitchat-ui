import React, { useRef, useEffect } from 'react'
import { Card, Form, Button, Image } from 'react-bootstrap'
import type { Message, OnlineUser } from '@/app/chat/page'

interface ChatMessagesProps {
  messages: Message[]
  user: { username: string } | null
  newMessage: string
  setNewMessage: (msg: string) => void
  selectedFiles: File[]
  setSelectedFiles: (files: File[]) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleSendMessage: () => void
  handleKeyPress: (e: React.KeyboardEvent) => void
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeSelectedFile: (index: number) => void
  formatFileSize: (bytes: number) => string
  handleImageClick: (imageUrl: string, allImages?: string[]) => void
  handleFileClick: (fileData: { name: string; size: number; url: string }) => void
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  user,
  newMessage,
  setNewMessage,
  selectedFiles,
  setSelectedFiles,
  fileInputRef,
  handleSendMessage,
  handleKeyPress,
  handleFileSelect,
  removeSelectedFile,
  formatFileSize,
  handleImageClick,
  handleFileClick,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-grow-1 d-flex flex-column">
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
  )
}

export default ChatMessages 
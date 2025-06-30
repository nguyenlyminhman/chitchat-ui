import React from 'react'
import { Modal, Button } from 'react-bootstrap'

interface FileModalProps {
  show: boolean
  fileData: { name: string; size: number; url: string } | null
  formatFileSize: (bytes: number) => string
  onHide: () => void
  onDownload: (url: string, fileName: string) => void
}

const FileModal: React.FC<FileModalProps> = ({
  show,
  fileData,
  formatFileSize,
  onHide,
  onDownload,
}) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>File Details</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {fileData && (
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
            <h5>{fileData.name}</h5>
            <p className="text-muted mb-0">{formatFileSize(fileData.size)}</p>
          </div>
        </div>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>
        Close
      </Button>
      <Button 
        variant="primary" 
        onClick={() => {
          if (fileData) {
            onDownload(fileData.url, fileData.name)
          }
        }}
      >
        Download
      </Button>
    </Modal.Footer>
  </Modal>
)

export default FileModal 
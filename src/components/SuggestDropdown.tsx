import React from 'react'
import { PeopleFill } from 'react-bootstrap-icons'

export default function SuggestDropdown({
  show,
  friendSuggestions,
  onClose
}: {
  show: boolean,
  friendSuggestions: any[],
  onClose: () => void
}) {
  if (!show) return null
  return (
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
      <div className="border-bottom px-3 py-2 fw-bold d-flex justify-content-between align-items-center">
        <span>Gợi ý kết bạn</span>
        <button className="btn btn-sm btn-light" onClick={onClose}>×</button>
      </div>
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
  )
} 
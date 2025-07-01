import React from 'react'

export default function SearchDropdown({
  show,
  searchText,
  setSearchText,
  searchResults,
  onClose
}: {
  show: boolean,
  searchText: string,
  setSearchText: (text: string) => void,
  searchResults: any[],
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
        <span>Tìm kiếm tin nhắn</span>
        <button className="btn btn-sm btn-light" onClick={onClose}>×</button>
      </div>
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
  )
} 
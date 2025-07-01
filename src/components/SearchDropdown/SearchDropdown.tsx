import React from 'react'
import styles from './SearchDropdown.module.scss'

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
    <div className={styles.dropdownWrapper}>
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
      <div className={styles.searchList}>
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
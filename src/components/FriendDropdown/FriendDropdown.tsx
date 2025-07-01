import React from 'react'
import { PersonPlus, PersonXFill, PersonCheckFill, Inbox, Check2Circle, XCircle } from 'react-bootstrap-icons'
import styles from './FriendDropdown.module.scss'

export default function FriendDropdown({
  show,
  friendTab,
  setFriendTab,
  friendBlocked,
  friendInvited,
  friendReceived,
  onClose
}: {
  show: boolean,
  friendTab: 'blocked'|'invited'|'received',
  setFriendTab: (tab: 'blocked'|'invited'|'received') => void,
  friendBlocked: any[],
  friendInvited: any[],
  friendReceived: any[],
  onClose: () => void
}) {
  if (!show) return null
  return (
    <div className={styles.dropdownWrapper}>
      <div className="border-bottom px-3 py-2 fw-bold d-flex justify-content-between align-items-center">
        <span>Quản lý bạn bè</span>
        <button className="btn btn-sm btn-light" onClick={onClose}>×</button>
      </div>
      <div className={`d-flex border-bottom px-2 pb-1 pt-2 ${styles.tabs}`}>
        <button className={`btn btn-sm d-flex align-items-center gap-1 ${friendTab==='blocked'?'btn-primary':'btn-light'}`} onClick={()=>setFriendTab('blocked')}><PersonXFill size={16}/>Đã chặn</button>
        <button className={`btn btn-sm d-flex align-items-center gap-1 ${friendTab==='invited'?'btn-primary':'btn-light'}`} onClick={()=>setFriendTab('invited')}><PersonCheckFill size={16}/>Đã mời</button>
        <button className={`btn btn-sm d-flex align-items-center gap-1 ${friendTab==='received'?'btn-primary':'btn-light'}`} onClick={()=>setFriendTab('received')}><Inbox size={16}/>Lời mời</button>
      </div>
      <div className={styles.friendList}>
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
  )
} 
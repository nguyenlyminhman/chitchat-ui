import React from 'react'
import { Bell, Inbox, Envelope, EnvelopeOpen } from 'react-bootstrap-icons'
import styles from './NotificationDropdown.module.scss'

export default function NotificationDropdown({
  show,
  notifications,
  notificationTab,
  setNotificationTab,
  shownNotifications,
  filteredNotifications,
  notificationListDiv,
  handleNotificationClick,
  onClose
}: {
  show: boolean,
  notifications: any[],
  notificationTab: 'all' | 'unread' | 'read',
  setNotificationTab: (tab: 'all' | 'unread' | 'read') => void,
  shownNotifications: any[],
  filteredNotifications: any[],
  notificationListDiv: React.RefObject<HTMLDivElement>,
  handleNotificationClick: (n: any) => void,
  onClose: () => void
}) {
  if (!show) return null
  return (
    <div className={styles.dropdownWrapper}>
      <div className="border-bottom px-3 py-2 fw-bold d-flex justify-content-between align-items-center">
        <span>Thông báo</span>
        <button className={`btn btn-sm btn-light ${styles.closeBtn}`} onClick={onClose}>×</button>
      </div>
      <div className={`d-flex border-bottom px-2 pb-1 pt-2 ${styles.tabs}`}>
        <button className={`btn btn-sm d-flex align-items-center gap-1 ${notificationTab==='all'?'btn-primary':'btn-light'}`} onClick={()=>setNotificationTab('all')}><Inbox size={16}/>Tất cả</button>
        <button className={`btn btn-sm d-flex align-items-center gap-1 ${notificationTab==='unread'?'btn-primary':'btn-light'}`} onClick={()=>setNotificationTab('unread')}><Envelope size={16}/>Chưa đọc</button>
        <button className={`btn btn-sm d-flex align-items-center gap-1 ${notificationTab==='read'?'btn-primary':'btn-light'}`} onClick={()=>setNotificationTab('read')}><EnvelopeOpen size={16}/>Đã đọc</button>
      </div>
      <div ref={notificationListDiv} className={styles.notificationList}>
        {shownNotifications.length === 0 ? (
          <div className="text-center text-muted py-4">Không có thông báo</div>
        ) : shownNotifications.map(n => (
          <div
            key={n.id}
            className={`px-3 py-2 d-flex align-items-center gap-2 ${!n.read ? 'bg-light' : ''} ${styles.notificationItem}`}
            onClick={()=>handleNotificationClick(n)}
          >
            {!n.read && <span className={styles.unreadDot} />}
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
  )
} 
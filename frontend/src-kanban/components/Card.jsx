import { useState, useRef } from 'react'
import './Card.css'

const LABEL_COLORS = {
  research: '#8b5cf6',
  planning: '#3b82f6',
  devops: '#f59e0b',
  frontend: '#10b981',
  backend: '#ef4444',
  review: '#ec4899',
  setup: '#6b7280',
}

const MEMBERS = ['Princi', 'Rahul', 'Anjali', 'Rohit']

export default function Card({ card, listId, index, onMoveCard, onDeleteCard, onRenameCard, onUpdateCard, dragState, setDragState }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [showMenu, setShowMenu] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [dueDate, setDueDate] = useState(card.due_date || '')
  const [member, setMember] = useState(card.member || '')
  const inputRef = useRef(null)

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', card.id)
    setDragState({ cardId: card.id, fromListId: listId })
    e.target.classList.add('dragging')
  }

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging')
    setDragState(null)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!dragState) return
    const { cardId, fromListId } = dragState
    if (cardId === card.id) return
    onMoveCard(cardId, fromListId, listId, index)
    setDragState(null)
  }

  const handleRename = () => {
    const newTitle = editTitle.trim()
    if (newTitle && newTitle !== card.title) {
      onRenameCard(card.id, listId, newTitle)
    }
    setIsEditing(false)
  }

  const startEditing = () => {
    setEditTitle(card.title)
    setIsEditing(true)
    setShowMenu(false)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const handleUpdateCard = () => {
    onUpdateCard(card.id, listId, { due_date: dueDate, member })
    setShowDetail(false)
  }

  return (
    <>
      <div
        className="card"
        draggable={!isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {card.labels.length > 0 && (
          <div className="card-labels">
            {card.labels.map(label => (
              <span
                key={label}
                className="card-label"
                style={{ backgroundColor: LABEL_COLORS[label] || '#6b7280' }}
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {isEditing ? (
          <input
            ref={inputRef}
            className="card-edit-input"
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') setIsEditing(false)
            }}
            onBlur={handleRename}
          />
        ) : (
          <div className="card-title" onDoubleClick={startEditing}>
            {card.title}
          </div>
        )}

        {(card.due_date || card.member) && (
          <div className="card-extra">
            {card.member && <span className="card-member">👤 {card.member}</span>}
            {card.due_date && <span className="card-due">📅 {card.due_date}</span>}
          </div>
        )}

        <div className="card-meta">
          <span className="card-date">{card.created_at}</span>
          <button className="card-menu-btn" onClick={() => setShowMenu(!showMenu)}>⋯</button>
        </div>

        {showMenu && (
          <div className="card-menu">
            <button onClick={startEditing}>✏️ Rename</button>
            <button onClick={() => { setShowDetail(true); setShowMenu(false) }}>📝 Edit Details</button>
            <button onClick={() => { onDeleteCard(card.id, listId); setShowMenu(false) }}>🗑️ Delete</button>
          </div>
        )}
      </div>

      {showDetail && (
        <div className="card-modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="card-modal" onClick={e => e.stopPropagation()}>
            <h3>✏️ Edit Card</h3>
            <p><strong>{card.title}</strong></p>

            <label>📅 Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />

            <label>👤 Assign Member</label>
            <select value={member} onChange={e => setMember(e.target.value)}>
              <option value="">-- Select Member --</option>
              {MEMBERS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <div className="modal-actions">
              <button className="btn-save" onClick={handleUpdateCard}>Save</button>
              <button className="btn-cancel" onClick={() => setShowDetail(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
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

export default function Card({ card, listId, index, onMoveCard, onDeleteCard, onRenameCard, dragState, setDragState }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(card.title)
  const [showMenu, setShowMenu] = useState(false)
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

  return (
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

      <div className="card-meta">
        <span className="card-date">{card.created_at}</span>
        <button className="card-menu-btn" onClick={() => setShowMenu(!showMenu)}>⋯</button>
      </div>

      {showMenu && (
        <div className="card-menu">
          <button onClick={startEditing}>✏️ Rename</button>
          <button onClick={() => { onDeleteCard(card.id, listId); setShowMenu(false) }}>🗑️ Delete</button>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import Card from './Card.jsx'
import './List.css'

export default function List({ list, onMoveCard, onAddCard, onDeleteCard, onRenameCard, dragState, setDragState }) {
  const [newCardTitle, setNewCardTitle] = useState('')
  const [showAddCard, setShowAddCard] = useState(false)

  const handleAddCard = () => {
    const title = newCardTitle.trim()
    if (!title) return
    onAddCard(list.id, title)
    setNewCardTitle('')
    setShowAddCard(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (!dragState) return
    const { cardId, fromListId } = dragState
    if (fromListId !== list.id) {
      onMoveCard(cardId, fromListId, list.id, list.cards.length)
    }
    setDragState(null)
  }

  return (
    <div
      className="list"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <h3>{list.title}</h3>
        <span className="card-count">{list.cards.length}</span>
      </div>

      <div className="list-cards">
        {list.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            listId={list.id}
            index={index}
            onMoveCard={onMoveCard}
            onDeleteCard={onDeleteCard}
            onRenameCard={onRenameCard}
            dragState={dragState}
            setDragState={setDragState}
          />
        ))}
      </div>

      <div className="list-footer">
        {showAddCard ? (
          <div className="add-card-form">
            <input
              type="text"
              placeholder="Card title…"
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCard()}
              autoFocus
            />
            <div className="add-card-actions">
              <button className="btn-primary btn-sm" onClick={handleAddCard}>Add</button>
              <button className="btn-ghost btn-sm" onClick={() => setShowAddCard(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button className="add-card-btn" onClick={() => setShowAddCard(true)}>
            + Add Card
          </button>
        )}
      </div>
    </div>
  )
}

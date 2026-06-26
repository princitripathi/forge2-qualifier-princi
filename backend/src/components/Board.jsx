import { useState } from 'react'
import List from './List.jsx'
import './Board.css'

export default function Board({ board, onMoveCard, onAddCard, onDeleteCard, onAddList, onRenameCard, dragState, setDragState }) {
  const [newListTitle, setNewListTitle] = useState('')
  const [showAddList, setShowAddList] = useState(false)

  const handleAddList = () => {
    const title = newListTitle.trim()
    if (!title) return
    onAddList(title)
    setNewListTitle('')
    setShowAddList(false)
  }

  return (
    <div className="board">
      <div className="board-lists">
        {board.lists.map(list => (
          <List
            key={list.id}
            list={list}
            onMoveCard={onMoveCard}
            onAddCard={onAddCard}
            onDeleteCard={onDeleteCard}
            onRenameCard={onRenameCard}
            dragState={dragState}
            setDragState={setDragState}
          />
        ))}

        <div className="add-list-wrapper">
          {showAddList ? (
            <div className="add-list-form">
              <input
                type="text"
                placeholder="List title…"
                value={newListTitle}
                onChange={e => setNewListTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddList()}
                autoFocus
              />
              <div className="add-list-actions">
                <button className="btn-primary" onClick={handleAddList}>Add List</button>
                <button className="btn-ghost" onClick={() => setShowAddList(false)}>✕</button>
              </div>
            </div>
          ) : (
            <button className="add-list-btn" onClick={() => setShowAddList(true)}>
              + Add List
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

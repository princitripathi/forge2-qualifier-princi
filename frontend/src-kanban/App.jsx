import { useState, useCallback } from 'react'
import Board from './components/Board.jsx'
import { MOCK_DATA, mockApi } from './data/mockApi.js'
import './App.css'

function App() {
  const [board, setBoard] = useState(MOCK_DATA)
  const [dragState, setDragState] = useState(null)

  const handleMoveCard = useCallback((cardId, fromListId, toListId, toIndex) => {
    setBoard(prev => {
      const newList = prev.lists.map(l => ({ ...l, cards: [...l.cards] }))
      const fromList = newList.find(l => l.id === fromListId)
      const toList = newList.find(l => l.id === toListId)
      if (!fromList || !toList) return prev
      const cardIdx = fromList.cards.findIndex(c => c.id === cardId)
      if (cardIdx === -1) return prev
      const [card] = fromList.cards.splice(cardIdx, 1)
      const insertIdx = toIndex ?? toList.cards.length
      toList.cards.splice(insertIdx, 0, card)
      mockApi.moveCard(cardId, fromListId, toListId, toIndex)
      return { ...prev, lists: newList }
    })
  }, [])

  const handleAddCard = useCallback((listId, title) => {
    const newCard = mockApi.addCard(listId, title)
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l
      ),
    }))
  }, [])

  const handleDeleteCard = useCallback((cardId, listId) => {
    mockApi.deleteCard(cardId)
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId ? { ...l, cards: l.cards.filter(c => c.id !== cardId) } : l
      ),
    }))
  }, [])

  const handleAddList = useCallback((title) => {
    const newList = mockApi.addList(title)
    setBoard(prev => ({ ...prev, lists: [...prev.lists, newList] }))
  }, [])

  const handleRenameCard = useCallback((cardId, listId, newTitle) => {
    mockApi.renameCard(cardId, newTitle)
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId
          ? { ...l, cards: l.cards.map(c => (c.id === cardId ? { ...c, title: newTitle } : c)) }
          : l
      ),
    }))
  }, [])

  const handleUpdateCard = useCallback((cardId, listId, data) => {
    mockApi.updateCard(cardId, data)
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId
          ? { ...l, cards: l.cards.map(c => (c.id === cardId ? { ...c, ...data } : c)) }
          : l
      ),
    }))
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 {board.title}</h1>
        <span className="badge">MVP</span>
      </header>
      <Board
        board={board}
        onMoveCard={handleMoveCard}
        onAddCard={handleAddCard}
        onDeleteCard={handleDeleteCard}
        onAddList={handleAddList}
        onRenameCard={handleRenameCard}
        onUpdateCard={handleUpdateCard}
        dragState={dragState}
        setDragState={setDragState}
      />
    </div>
  )
}

export default App
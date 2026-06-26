import { useState, useEffect, useCallback } from 'react'
import './App.css'

const API = '/api'

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  if (res.status === 204) return null
  return res.json()
}

let nextId = 10000
function genId() {
  return ++nextId
}

function App() {
  const [boards, setBoards] = useState([])
  const [activeBoard, setActiveBoard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadBoards = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api('/boards')
      setBoards(data)
      if (data.length && !activeBoard) setActiveBoard(data[0].id)
    } catch (e) {
      setError('Could not connect to API. Make sure Laravel is running on port 8000.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadBoards() }, [])

  const currentBoard = boards.find(b => b.id === activeBoard)

  async function addBoard(e) {
    e.preventDefault()
    const title = e.target.title.value.trim()
    if (!title) return
    const board = await api('/boards', { method: 'POST', body: JSON.stringify({ title }) })
    setBoards([...boards, board])
    setActiveBoard(board.id)
    e.target.reset()
  }

  async function deleteBoard(boardId) {
    await api(`/boards/${boardId}`, { method: 'DELETE' })
    const updated = boards.filter(b => b.id !== boardId)
    setBoards(updated)
    if (activeBoard === boardId) setActiveBoard(updated[0]?.id || null)
  }

  async function addList(e) {
    e.preventDefault()
    const title = e.target.title.value.trim()
    if (!title || !activeBoard) return
    const list = await api(`/boards/${activeBoard}/lists`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    })
    setBoards(boards.map(b =>
      b.id === activeBoard ? { ...b, lists: [...b.lists, list] } : b
    ))
    e.target.reset()
  }

  async function deleteList(listId) {
    await api(`/lists/${listId}`, { method: 'DELETE' })
    setBoards(boards.map(b =>
      b.id === activeBoard
        ? { ...b, lists: b.lists.filter(l => l.id !== listId) }
        : b
    ))
  }

  async function addCard(listId, title) {
    const card = await api(`/lists/${listId}/cards`, {
      method: 'POST',
      body: JSON.stringify({ title }),
    })
    setBoards(boards.map(b =>
      b.id === activeBoard
        ? {
            ...b,
            lists: b.lists.map(l =>
              l.id === listId ? { ...l, cards: [...l.cards, card] } : l
            ),
          }
        : b
    ))
  }

  async function deleteCard(cardId, listId) {
    await api(`/cards/${cardId}`, { method: 'DELETE' })
    setBoards(boards.map(b =>
      b.id === activeBoard
        ? {
            ...b,
            lists: b.lists.map(l =>
              l.id === listId ? { ...l, cards: l.cards.filter(c => c.id !== cardId) } : l
            ),
          }
        : b
    ))
  }

  async function moveCard(cardId, fromListId, toListId) {
    await api(`/cards/${cardId}`, {
      method: 'PATCH',
      body: JSON.stringify({ list_id: toListId }),
    })
    setBoards(boards.map(b => {
      if (b.id !== activeBoard) return b
      let movedCard = null
      const lists = b.lists.map(l => {
        if (l.id === fromListId) {
          const card = l.cards.find(c => c.id === cardId)
          if (card) movedCard = card
          return { ...l, cards: l.cards.filter(c => c.id !== cardId) }
        }
        return l
      })
      if (movedCard) {
        return {
          ...b,
          lists: lists.map(l =>
            l.id === toListId ? { ...l, cards: [...l.cards, movedCard] } : l
          ),
        }
      }
      return { ...b, lists }
    }))
  }

  if (loading) return <div className="app"><div className="loading">Loading...</div></div>

  if (error) return (
    <div className="app">
      <div className="error-screen">
        <h2>⚠️ Connection Error</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={loadBoards}>Retry</button>
      </div>
    </div>
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>📋 Kanban</h2>
          <button className="reset-btn" onClick={loadBoards} title="Refresh">↻</button>
        </div>
        <form onSubmit={addBoard} className="add-form">
          <input name="title" placeholder="New board..." />
          <button type="submit">+</button>
        </form>
        <ul className="board-list">
          {boards.map(b => (
            <li key={b.id} className={b.id === activeBoard ? 'active' : ''}>
              <button onClick={() => setActiveBoard(b.id)}>{b.title}</button>
              <button className="delete-btn" onClick={() => deleteBoard(b.id)}>×</button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="board-main">
        {currentBoard ? (
          <>
            <header className="board-header">
              <h1>{currentBoard.title}</h1>
              <span className="card-count">
                {currentBoard.lists.reduce((sum, l) => sum + l.cards.length, 0)} cards
              </span>
            </header>
            <div className="lists-container">
              {currentBoard.lists.map(list => (
                <List
                  key={list.id}
                  list={list}
                  onAddCard={addCard}
                  onMoveCard={moveCard}
                  onDeleteCard={deleteCard}
                  onDeleteList={deleteList}
                />
              ))}
              <form onSubmit={addList} className="new-list-form">
                <input name="title" placeholder="+ Add a list..." />
                <button type="submit">Add List</button>
              </form>
            </div>
          </>
        ) : (
          <div className="empty">
            <h2>Welcome to Kanban</h2>
            <p>Create a board to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}

function List({ list, onAddCard, onMoveCard, onDeleteCard, onDeleteList }) {
  const [adding, setAdding] = useState(false)
  const [cardTitle, setCardTitle] = useState('')

  function submitCard(e) {
    e.preventDefault()
    if (!cardTitle.trim()) return
    onAddCard(list.id, cardTitle.trim())
    setCardTitle('')
    setAdding(false)
  }

  function handleDragStart(e, card) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ cardId: card.id, fromListId: list.id }))
    e.target.style.opacity = '0.5'
  }

  function handleDragEnd(e) {
    e.target.style.opacity = '1'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over')
  }

  function handleDrop(e) {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const data = JSON.parse(e.dataTransfer.getData('text/plain'))
    if (data.fromListId !== list.id) {
      onMoveCard(data.cardId, data.fromListId, list.id)
    }
  }

  return (
    <div
      className="list"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <h3>{list.title}</h3>
        <div className="list-actions">
          <span className="badge">{list.cards.length}</span>
          <button className="delete-btn" onClick={() => onDeleteList(list.id)}>×</button>
        </div>
      </div>
      <div className="list-cards">
        {list.cards.map(card => (
          <div
            key={card.id}
            className="card"
            draggable
            onDragStart={(e) => handleDragStart(e, card)}
            onDragEnd={handleDragEnd}
          >
            <span>{card.title}</span>
            <button className="delete-btn" onClick={() => onDeleteCard(card.id, list.id)}>×</button>
          </div>
        ))}
      </div>
      {adding ? (
        <form onSubmit={submitCard} className="card-form">
          <input
            autoFocus
            value={cardTitle}
            onChange={e => setCardTitle(e.target.value)}
            onBlur={() => { setAdding(false); setCardTitle('') }}
            onKeyDown={e => { if (e.key === 'Escape') { setAdding(false); setCardTitle('') } }}
            placeholder="Enter card title..."
          />
          <div className="card-form-actions">
            <button type="submit" className="btn-primary">Add</button>
            <button type="button" className="btn-secondary" onClick={() => { setAdding(false); setCardTitle('') }}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-card-btn" onClick={() => setAdding(true)}>+ Add card</button>
      )}
    </div>
  )
}

export default App

// Mock API that mirrors Laravel-style endpoints
// In production, replace these with fetch('/api/...') calls

let nextCardId = 100
let nextListId = 100

const MOCK_DATA = {
  id: 1,
  title: 'Project Kanban',
  lists: [
    {
      id: 1,
      title: 'Backlog',
      cards: [
        { id: 1, title: 'Research competitor tools', description: '', labels: ['research'], created_at: '2026-06-24' },
        { id: 2, title: 'Define MVP scope', description: '', labels: ['planning'], created_at: '2026-06-24' },
        { id: 3, title: 'Setup CI/CD pipeline', description: '', labels: ['devops'], created_at: '2026-06-24' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      cards: [
        { id: 4, title: 'Build Kanban board UI', description: 'Drag-and-drop cards', labels: ['frontend'], created_at: '2026-06-25' },
        { id: 5, title: 'Design card model & API', description: '', labels: ['backend'], created_at: '2026-06-25' },
      ],
    },
    {
      id: 3,
      title: 'Review',
      cards: [
        { id: 6, title: 'Code review: auth module', description: '', labels: ['review'], created_at: '2026-06-25' },
      ],
    },
    {
      id: 4,
      title: 'Done',
      cards: [
        { id: 7, title: 'Project scaffolding', description: 'Vite + React + Laravel', labels: ['setup'], created_at: '2026-06-23' },
        { id: 8, title: 'Git repo initialized', description: '', labels: [], created_at: '2026-06-23' },
      ],
    },
  ],
}

const mockApi = {
  // GET /api/boards/{id}
  getBoard: () => Promise.resolve(MOCK_DATA),

  // POST /api/boards/{id}/lists
  addList: (title) => {
    const list = { id: nextListId++, title, cards: [] }
    return list
  },

  // POST /api/lists/{id}/cards
  addCard: (listId, title) => {
    const card = {
      id: nextCardId++,
      title,
      description: '',
      labels: [],
      created_at: new Date().toISOString().slice(0, 10),
    }
    return card
  },

  // PUT /api/cards/{id}/move
  moveCard: (cardId, fromListId, toListId, toIndex) => {
    // In production: fetch(`/api/cards/${cardId}/move`, { method: 'PUT', body: JSON.stringify({ from_list_id: fromListId, to_list_id: toListId, position: toIndex }) })
    console.log(`[API] PUT /api/cards/${cardId}/move`, { fromListId, toListId, toIndex })
  },

  // DELETE /api/cards/{id}
  deleteCard: (cardId) => {
    console.log(`[API] DELETE /api/cards/${cardId}`)
  },

  // PUT /api/cards/{id}
  renameCard: (cardId, title) => {
    console.log(`[API] PUT /api/cards/${cardId}`, { title })
  },
}

export { MOCK_DATA, mockApi }

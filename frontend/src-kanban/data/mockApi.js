let nextCardId = 100
let nextListId = 100

const MEMBERS = ['Princi', 'Rahul', 'Anjali', 'Rohit']

const MOCK_DATA = {
  id: 1,
  title: 'Project Kanban',
  lists: [
    {
      id: 1,
      title: 'Backlog',
      cards: [
        { id: 1, title: 'Research competitor tools', description: '', labels: ['research'], created_at: '2026-06-24', due_date: '2026-06-30', member: 'Princi' },
        { id: 2, title: 'Define MVP scope', description: '', labels: ['planning'], created_at: '2026-06-24', due_date: '2026-06-28', member: 'Rahul' },
        { id: 3, title: 'Setup CI/CD pipeline', description: '', labels: ['devops'], created_at: '2026-06-24', due_date: '2026-07-01', member: 'Anjali' },
      ],
    },
    {
      id: 2,
      title: 'In Progress',
      cards: [
        { id: 4, title: 'Build Kanban board UI', description: 'Drag-and-drop cards', labels: ['frontend'], created_at: '2026-06-25', due_date: '2026-06-27', member: 'Princi' },
        { id: 5, title: 'Design card model & API', description: '', labels: ['backend'], created_at: '2026-06-25', due_date: '2026-06-28', member: 'Rohit' },
      ],
    },
    {
      id: 3,
      title: 'Review',
      cards: [
        { id: 6, title: 'Code review: auth module', description: '', labels: ['review'], created_at: '2026-06-25', due_date: '2026-06-27', member: 'Anjali' },
      ],
    },
    {
      id: 4,
      title: 'Done',
      cards: [
        { id: 7, title: 'Project scaffolding', description: 'Vite + React + Laravel', labels: ['setup'], created_at: '2026-06-23', due_date: '2026-06-23', member: 'Princi' },
        { id: 8, title: 'Git repo initialized', description: '', labels: [], created_at: '2026-06-23', due_date: '2026-06-23', member: 'Rahul' },
      ],
    },
  ],
}

const mockApi = {
  getBoard: () => Promise.resolve(MOCK_DATA),
  getMembers: () => MEMBERS,
  addList: (title) => {
    const list = { id: nextListId++, title, cards: [] }
    return list
  },
  addCard: (listId, title) => {
    const card = {
      id: nextCardId++,
      title,
      description: '',
      labels: [],
      created_at: new Date().toISOString().slice(0, 10),
      due_date: '',
      member: '',
    }
    return card
  },
  moveCard: (cardId, fromListId, toListId, toIndex) => {
    console.log(`[API] PUT /api/cards/${cardId}/move`, { fromListId, toListId, toIndex })
  },
  deleteCard: (cardId) => {
    console.log(`[API] DELETE /api/cards/${cardId}`)
  },
  renameCard: (cardId, title) => {
    console.log(`[API] PUT /api/cards/${cardId}`, { title })
  },
  updateCard: (cardId, data) => {
    console.log(`[API] PUT /api/cards/${cardId}`, data)
  },
}

export { MOCK_DATA, mockApi, MEMBERS }
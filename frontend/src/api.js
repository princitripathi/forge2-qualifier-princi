const BASE = '/api';

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}

export const api = {
  // Boards
  getBoards: () => fetch(`${BASE}/boards`).then(r => r.json()),
  getBoard: (id) => fetch(`${BASE}/boards/${id}`).then(r => r.json()),
  createBoard: (title) => fetch(`${BASE}/boards`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ title })
  }).then(r => r.json()),

  // Lists
  createList: (boardId, title) => fetch(`${BASE}/boards/${boardId}/lists`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ title })
  }).then(r => r.json()),
  updateList: (id, data) => fetch(`${BASE}/lists/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteList: (id) => fetch(`${BASE}/lists/${id}`, {
    method: 'DELETE', headers: { 'Accept': 'application/json' }
  }).then(r => r.ok),

  // Cards
  createCard: (listId, title) => fetch(`${BASE}/lists/${listId}/cards`, {
    method: 'POST', headers: authHeaders(), body: JSON.stringify({ title })
  }).then(r => r.json()),
  updateCard: (id, data) => fetch(`${BASE}/cards/${id}`, {
    method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteCard: (id) => fetch(`${BASE}/cards/${id}`, {
    method: 'DELETE', headers: { 'Accept': 'application/json' }
  }).then(r => r.ok),
};

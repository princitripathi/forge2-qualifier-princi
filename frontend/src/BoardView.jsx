import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export default function BoardView({ boardId, onBack }) {
  const [board, setBoard] = useState(null);
  const [newCardInputs, setNewCardInputs] = useState({});
  const [newListTitle, setNewListTitle] = useState('');

  async function loadBoard() {
    const data = await api.getBoard(boardId);
    setBoard(data);
  }

  useEffect(() => { loadBoard(); }, [boardId]);

  const moveCard = useCallback(async (cardId, fromListId, toListId, toIndex) => {
    // Optimistic update
    setBoard(prev => {
      const next = { ...prev, lists: prev.lists.map(l => ({ ...l, cards: [...l.cards] })) };
      const fromList = next.lists.find(l => l.id === fromListId);
      const toList = next.lists.find(l => l.id === toListId);
      if (!fromList || !toList) return prev;

      const cardIdx = fromList.cards.findIndex(c => c.id === cardId);
      if (cardIdx === -1) return prev;
      const [card] = fromList.cards.splice(cardIdx, 1);
      toList.cards.splice(toIndex, 0, { ...card, list_id: toListId });
      return next;
    });

    // API call
    await api.updateCard(cardId, { list_id: toListId, position: toIndex });
  }, []);

  async function addCard(listId) {
    const title = newCardInputs[listId]?.trim();
    if (!title) return;
    const card = await api.createCard(listId, title);
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, cards: [...l.cards, card] } : l)
    }));
    setNewCardInputs({ ...newCardInputs, [listId]: '' });
  }

  async function deleteCard(cardId) {
    await api.deleteCard(cardId);
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l => ({ ...l, cards: l.cards.filter(c => c.id !== cardId) }))
    }));
  }

  async function addList() {
    const title = newListTitle.trim();
    if (!title) return;
    const list = await api.createList(boardId, title);
    setBoard(prev => ({ ...prev, lists: [...prev.lists, { ...list, cards: [] }] }));
    setNewListTitle('');
  }

  async function deleteList(listId) {
    await api.deleteList(listId);
    setBoard(prev => ({ ...prev, lists: prev.lists.filter(l => l.id !== listId) }));
  }

  if (!board) return <div style={styles.loading}>Loading board...</div>;

  return (
    <div style={styles.board}>
      <div style={styles.boardHeader}>
        <button onClick={onBack} style={styles.btnBack}>← Back</button>
        <h2 style={styles.h2}>{board.title}</h2>
      </div>

      <div style={styles.lists}>
        {board.lists.map(list => (
          <div key={list.id} style={styles.list}>
            <div style={styles.listHeader}>
              <span style={styles.listTitle}>{list.title}</span>
              <button onClick={() => deleteList(list.id)} style={styles.btnDelete}>×</button>
            </div>

            <div style={styles.cards}>
              {list.cards.map((card, idx) => (
                <div
                  key={card.id}
                  style={styles.card}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('cardId', String(card.id));
                    e.dataTransfer.setData('fromListId', String(list.id));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const cardId = parseInt(e.dataTransfer.getData('cardId'));
                    const fromListId = parseInt(e.dataTransfer.getData('fromListId'));
                    if (cardId && fromListId) {
                      moveCard(cardId, fromListId, list.id, idx);
                    }
                  }}
                >
                  <div style={styles.cardTitle}>{card.title}</div>
                  {card.description && <div style={styles.cardDesc}>{card.description}</div>}
                  <button onClick={() => deleteCard(card.id)} style={styles.btnDeleteCard}>×</button>
                </div>
              ))}
            </div>

            <div style={styles.addCard}>
              <input
                placeholder="Add card..."
                value={newCardInputs[list.id] || ''}
                onChange={(e) => setNewCardInputs({ ...newCardInputs, [list.id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && addCard(list.id)}
                style={styles.cardInput}
              />
              <button onClick={() => addCard(list.id)} style={styles.btnAdd}>+</button>
            </div>
          </div>
        ))}

        <div style={styles.newList}>
          <input
            placeholder="New list title..."
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addList()}
            style={styles.input}
          />
          <button onClick={addList} style={styles.btnPrimary}>+ List</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  board: { padding: 24 },
  loading: { padding: 24, color: '#aaa' },
  boardHeader: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 },
  h2: { margin: 0 },
  btnBack: { padding: '4px 10px', borderRadius: 4, border: '1px solid #444', background: 'transparent', color: '#aaa', cursor: 'pointer' },
  lists: { display: 'flex', gap: 16, overflowX: 'auto', alignItems: 'flex-start' },
  list: { background: '#16213e', borderRadius: 8, padding: 12, minWidth: 260, maxWidth: 260, border: '1px solid #333' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  listTitle: { fontWeight: 600, fontSize: 14 },
  btnDelete: { background: 'none', border: 'none', color: '#666', fontSize: 18, cursor: 'pointer' },
  cards: { display: 'flex', flexDirection: 'column', gap: 6, minHeight: 20 },
  card: { background: '#0f3460', borderRadius: 6, padding: 8, position: 'relative', cursor: 'grab' },
  cardTitle: { fontSize: 14, wordBreak: 'break-word' },
  cardDesc: { fontSize: 12, color: '#aaa', marginTop: 4 },
  btnDeleteCard: { position: 'absolute', top: 4, right: 4, background: 'none', border: 'none', color: '#666', fontSize: 14, cursor: 'pointer' },
  addCard: { display: 'flex', gap: 4, marginTop: 8 },
  cardInput: { flex: 1, padding: '4px 8px', borderRadius: 4, border: '1px solid #444', background: '#1a1a2e', color: '#eee', fontSize: 13 },
  btnAdd: { padding: '4px 8px', borderRadius: 4, border: 'none', background: '#e94560', color: '#fff', cursor: 'pointer' },
  newList: { background: '#16213e', borderRadius: 8, padding: 12, minWidth: 260, border: '1px dashed #444', display: 'flex', flexDirection: 'column', gap: 8 },
  input: { padding: '6px 10px', borderRadius: 4, border: '1px solid #444', background: '#0f3460', color: '#eee' },
  btnPrimary: { padding: '6px 12px', borderRadius: 4, border: 'none', background: '#e94560', color: '#fff', cursor: 'pointer' },
};

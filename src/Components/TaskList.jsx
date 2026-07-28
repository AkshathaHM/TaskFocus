import { useState } from "react";

export default function TaskList({ tasks, updateTask, deleteTask, toggleComplete, reorderTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const startEdit = (task) => {
    setEditingId(task.id);
    setDraft({ ...task });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = (event) => {
    event.preventDefault();

    if (!draft.text.trim()) return;

    updateTask({
      ...draft,
      text: draft.text.trim(),
      notes: draft.notes.trim(),
    });

    cancelEdit();
  };

  const handleDelete = (taskId) => {
    setRemovingId(taskId);
    window.setTimeout(() => {
      deleteTask(taskId);
      setRemovingId(null);
    }, 220);
  };

  const getDueStatus = (task) => {
    if (!task.dueDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(`${task.dueDate}T00:00:00`);

    if (task.completed) {
      return { label: "Completed", className: "due-complete" };
    }

    if (dueDate < today) {
      return { label: "Overdue", className: "due-overdue" };
    }

    if (dueDate.getTime() === today.getTime()) {
      return { label: "Due today", className: "due-today" };
    }

    return { label: `Due ${task.dueDate}`, className: "due-upcoming" };
  };

  return (
    <ul className="task-list">
      {tasks.map((task) => {
        const isEditing = editingId === task.id;
        const dueStatus = getDueStatus(task);

        return (
          <li
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""} priority-${task.priority} ${removingId === task.id ? "removing" : ""}`}
            draggable
            onDragStart={() => setDraggedId(task.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggedId && draggedId !== task.id) {
                reorderTasks(draggedId, task.id);
              }
              setDraggedId(null);
            }}
            onDragEnd={() => setDraggedId(null)}
          >
            {isEditing ? (
              <form className="edit-form" onSubmit={saveEdit} onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  cancelEdit();
                }
              }}>
                <input
                  type="text"
                  value={draft.text}
                  onChange={(event) => setDraft({ ...draft, text: event.target.value })}
                />

                <div className="edit-grid">
                  <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>

                  <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
                    <option value="general">General</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>

                  <input
                    type="date"
                    value={draft.dueDate || ""}
                    onChange={(event) => setDraft({ ...draft, dueDate: event.target.value })}
                  />
                </div>

                <textarea
                  rows="3"
                  value={draft.notes || ""}
                  onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                />

                <div className="task-actions">
                  <button type="submit" className="btn btn-complete">Save</button>
                  <button type="button" className="btn btn-delete" onClick={cancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="task-content">
                  <div className="task-title-row">
                  <div className="task-title-group">
                    <span className={`task-dot priority-${task.priority}`} aria-hidden="true" />
                    <span className={`task-text ${task.completed ? "task-complete" : ""}`}>
                      {task.completed ? "✓ " : ""}
                      {task.text}
                    </span>
                  </div>
                  <div className="meta-row">
                      <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
                      <span className="category-pill">{task.category}</span>
                      {dueStatus && <span className={`due-badge ${dueStatus.className}`}>{dueStatus.label}</span>}
                    </div>
                  </div>
                  {task.notes && <p className="task-note">{task.notes}</p>}
                </div>

                <div className="task-actions">
                  <span className="drag-hint">↕ Drag</span>
                  <button
                    type="button"
                    className={`btn ${task.completed ? "btn-undo" : "btn-complete"}`}
                    onClick={() => toggleComplete(task.id)}
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>
                  <button type="button" className="btn btn-edit" onClick={() => startEdit(task)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-delete" onClick={() => handleDelete(task.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
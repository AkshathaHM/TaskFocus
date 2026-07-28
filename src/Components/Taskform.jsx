import { useState } from "react";

export default function Taskform({ addTask }) {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handlesubmit = (event) => {
    event.preventDefault();

    if (!task.trim()) return;

    addTask({
      text: task.trim(),
      priority,
      category,
      completed: false,
      dueDate,
      notes: notes.trim(),
    });

    setTask("");
    setPriority("medium");
    setCategory("general");
    setDueDate("");
    setNotes("");
  };

  return (
    <form onSubmit={handlesubmit} className="task-form">
      <div className="task-form-header">
        <div>
          <p className="form-kicker">Quick Add</p>
          <h3 className="form-title">Create a task</h3>
        </div>
        <span className="chip">✦ Fresh start</span>
      </div>

      <div className="task-form-main">
        <input
          type="text"
          placeholder="Enter the task"
          value={task}
          onChange={(event) => setTask(event.target.value)}
        />
        <button type="submit">Add Task</button>
      </div>

      <div className="task-form-extra">
        <select value={priority} onChange={(event) => setPriority(event.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>

        <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      </div>

      <textarea
        rows="3"
        placeholder="Add a note or description"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
    </form>
  );
}
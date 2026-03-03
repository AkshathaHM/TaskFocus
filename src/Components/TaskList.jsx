export default function TaskList({tasks , updateTask, deleteTask}) {

  const toggleComplete = (index)=>{
        const updatedTask = {...tasks[index], completed: !tasks[index].completed};
        updateTask(updatedTask, index);
    }
  return (
    <ul className="task-list">
      {tasks.map((task, index)=> (
        <li key={index} className={task.completed ? "completed" : ""}>
          <div>
            <span>{task.text}
              <small>({task.priority} , {task.category})</small>
            </span>
          </div>

          <div className="task-actions">
            <button
              type="button"
              className={`btn ${task.completed ? "btn-undo" : "btn-complete"}`}
              onClick={() => toggleComplete(index)}
            >
              {task.completed ? "Undo" : "Complete"}</button>
            <button
              type="button"
              className="btn btn-delete"
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
          </div>

        </li>
      ))}
    </ul>
  )
}

import Taskform from "./Componenets/Taskform";
import TaskList from "./Componenets/TaskList";
import Progresstracker from "./Componenets/Progresstracker";
function App() {
  return(
    <div>
      <h1>Task Focus</h1>
      <p>Our friendly TaskManager</p>
      <Taskform />
      <TaskList />
      <Progresstracker />
      <button>Clear all tasks</button>
    </div>
  )
}

export default App;
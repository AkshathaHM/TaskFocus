import Taskform from "./Components/Taskform";
import TaskList from "./Components/TaskList";
import Progresstracker from "./Components/Progresstracker";
import { useEffect, useMemo, useState } from "react";
import "./Components/Style.css";
import { filterAndSortTasks, normalizeTasks } from "./utils/taskUtils";

const INITIAL_FILTERS = {
  search: "",
  status: "all",
  priority: "all",
  category: "all",
  sortBy: "createdAt",
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "overdue", label: "Overdue" },
];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    if (typeof window === "undefined") return [];

    const savedTasks = window.localStorage.getItem("taskfocus-tasks");
    if (!savedTasks) return [];

    try {
      return normalizeTasks(JSON.parse(savedTasks));
    } catch {
      return [];
    }
  });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("taskfocus-theme") || "light";
  });

  useEffect(() => {
    window.localStorage.setItem("taskfocus-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("taskfocus-theme", theme);
  }, [theme]);

  const visibleTasks = useMemo(() => filterAndSortTasks(tasks, filters), [tasks, filters]);

  const addTask = (task) => {
    const nextTask = {
      ...task,
      id: task.id || `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: task.createdAt || new Date().toISOString(),
    };

    setTasks((currentTasks) => [...currentTasks, nextTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  };

  const toggleComplete = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const clearTasks = () => setTasks([]);
  const clearCompletedTasks = () => setTasks((currentTasks) => currentTasks.filter((task) => !task.completed));

  const reorderTasks = (fromId, toId) => {
    setTasks((currentTasks) => {
      const fromIndex = currentTasks.findIndex((task) => task.id === fromId);
      const toIndex = currentTasks.findIndex((task) => task.id === toId);

      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return currentTasks;

      const updatedTasks = [...currentTasks];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);
      return updatedTasks;
    });
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.filter((task) => !task.completed).length;
  const overdueCount = tasks.filter((task) => !task.completed && task.dueDate && new Date(`${task.dueDate}T00:00:00`) < new Date(new Date().setHours(0, 0, 0, 0))).length;
  const totalCount = tasks.length;

  const statusCounts = {
    all: totalCount,
    active: activeCount,
    completed: completedCount,
    overdue: overdueCount,
  };

  const handleFilterChange = (field, value) => {
    setFilters((currentFilters) => ({ ...currentFilters, [field]: value }));
  };

  return (
    <div className={`app-shell App ${theme === "dark" ? "dark-mode" : ""}`}>
      <header className="hero-panel">
        <div className="hero-copy">
          <span className="hero-badge">✨ Focus mode</span>
          <p className="eyebrow">Focus • Plan • Finish</p>
          <h1 className="title">Task Focus</h1>
          <p className="tagline">A calm, polished workspace for your priorities and daily wins.</p>
        </div>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "☀️ Light mode" : "🌙 Dark mode"}
        </button>
      </header>

      <section className="content-stack">
        <Taskform addTask={addTask} />

        {tasks.length > 0 && (
          <section className="toolbar" aria-label="Task filters and sort options">
            <input
              type="search"
              placeholder="Search tasks"
              value={filters.search}
              onChange={(event) => handleFilterChange("search", event.target.value)}
            />

            <div className="filter-row" role="tablist" aria-label="Task status filters">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`filter-chip ${filters.status === tab.key ? "active" : ""}`}
                  onClick={() => handleFilterChange("status", tab.key)}
                >
                  <span>{tab.label}</span>
                  <span className="filter-count">{statusCounts[tab.key]}</span>
                </button>
              ))}
            </div>

            <div className="toolbar-row">
              <select value={filters.priority} onChange={(event) => handleFilterChange("priority", event.target.value)}>
                <option value="all">Any priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select value={filters.category} onChange={(event) => handleFilterChange("category", event.target.value)}>
                <option value="all">All categories</option>
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
              </select>

              <select value={filters.sortBy} onChange={(event) => handleFilterChange("sortBy", event.target.value)}>
                <option value="createdAt">Newest first</option>
                <option value="priority">Priority</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="date">Oldest first</option>
              </select>
            </div>
          </section>
        )}

        <div className="task-summary">
          <span className="summary-pill">
            <strong>{completedCount}</strong> completed
          </span>
          <span className="summary-copy">
            of <strong>{totalCount}</strong> total tasks
          </span>
          <span className="summary-copy muted">
            {activeCount > 0 ? `${activeCount} still in motion` : "All clear for now"}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✦</div>
            <div>
              <strong>No tasks yet</strong>
              <p>Add your first task and it will stay here after refresh.</p>
            </div>
          </div>
        ) : (
          <TaskList
            tasks={visibleTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
            reorderTasks={reorderTasks}
          />
        )}

        <Progresstracker tasks={tasks} completedCount={completedCount} activeCount={activeCount} overdueCount={overdueCount} />

        <div className="action-row">
          {tasks.some((task) => task.completed) && (
            <button type="button" onClick={clearCompletedTasks} className="secondary-btn">
              Clear completed
            </button>
          )}
          {tasks.length > 0 && (
            <button type="button" onClick={clearTasks} className="clear-btn">
              Clear all tasks
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
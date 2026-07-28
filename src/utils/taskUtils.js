export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export const normalizeTasks = (tasks = []) =>
  tasks.map((task, index) => ({
    id: task.id ?? `task-${Date.now()}-${index}`,
    text: task.text ?? '',
    priority: task.priority ?? 'medium',
    category: task.category ?? 'general',
    completed: Boolean(task.completed),
    dueDate: task.dueDate ?? '',
    notes: task.notes ?? '',
    createdAt: task.createdAt ?? new Date().toISOString(),
  }));

export const filterAndSortTasks = (tasks = [], filters = {}) => {
  const { search = '', status = 'all', priority = 'all', category = 'all', sortBy = 'createdAt' } = filters;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
    const isOverdue = Boolean(task.dueDate) && !task.completed && new Date(`${task.dueDate}T00:00:00`) < today;

    const matchesStatus =
      status === 'all' ||
      (status === 'active' && !task.completed) ||
      (status === 'completed' && task.completed) ||
      (status === 'overdue' && isOverdue);

    const matchesPriority = priority === 'all' || task.priority === priority;
    const matchesCategory = category === 'all' || task.category === category;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'priority') {
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    }

    if (sortBy === 'alphabetical') {
      return a.text.localeCompare(b.text);
    }

    if (sortBy === 'date') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return sorted;
};

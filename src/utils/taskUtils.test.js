import { describe, expect, test } from 'vitest';
import { filterAndSortTasks, normalizeTasks } from './taskUtils';

describe('task utilities', () => {
  test('normalizes tasks and preserves existing ids', () => {
    const tasks = [
      { text: 'Write report', priority: 'high', category: 'work', completed: false },
      { id: 'task-2', text: 'Buy milk', priority: 'low', category: 'personal', completed: true }
    ];

    const normalized = normalizeTasks(tasks);

    expect(normalized[0].id).toBeDefined();
    expect(normalized[1].id).toBe('task-2');
    expect(normalized[0].completed).toBe(false);
    expect(normalized[0].createdAt).toBeDefined();
  });

  test('filters by status, search, priority, category and sorts by priority', () => {
    const tasks = normalizeTasks([
      { text: 'Plan launch', priority: 'high', category: 'work', completed: false, dueDate: '2026-07-28' },
      { text: 'Buy groceries', priority: 'low', category: 'personal', completed: false, dueDate: '2026-07-30' },
      { text: 'Write report', priority: 'medium', category: 'work', completed: true, dueDate: '2026-07-25' }
    ]);

    const result = filterAndSortTasks(tasks, {
      search: 'plan',
      status: 'active',
      priority: 'high',
      category: 'all',
      sortBy: 'priority'
    });

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Plan launch');
  });

  test('filters overdue tasks from active items', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasks = normalizeTasks([
      { text: 'Overdue task', priority: 'high', category: 'work', completed: false, dueDate: yesterday.toISOString().slice(0, 10) },
      { text: 'Future task', priority: 'medium', category: 'personal', completed: false, dueDate: tomorrow.toISOString().slice(0, 10) },
      { text: 'Done task', priority: 'low', category: 'general', completed: true, dueDate: yesterday.toISOString().slice(0, 10) }
    ]);

    const result = filterAndSortTasks(tasks, {
      status: 'overdue',
      priority: 'all',
      category: 'all',
      search: '',
      sortBy: 'createdAt'
    });

    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Overdue task');
  });
});

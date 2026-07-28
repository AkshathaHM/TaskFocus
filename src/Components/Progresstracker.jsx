export default function Progresstracker({ tasks, completedCount, activeCount, overdueCount }) {
  const totaltasks = tasks.length;
  const percenteage = totaltasks === 0 ? 0 : (completedCount / totaltasks) * 100;

  return (
    <div className="progress-tracker">
      <p className="progress-title">
        {completedCount} of {totaltasks} tasks completed
      </p>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${percenteage}%` }}></div>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <strong>{completedCount}</strong>
          <span>Completed</span>
        </div>
        <div className="stat-card">
          <strong>{activeCount}</strong>
          <span>Active</span>
        </div>
        <div className="stat-card">
          <strong>{overdueCount}</strong>
          <span>Overdue</span>
        </div>
      </div>
    </div>
  );
}
import { CalendarDays, UserRound } from 'lucide-react'
import type { Task } from '../types'

interface Props {
  task: Task
  onStatusChange?: (id: string, status: Task['status']) => void
}

export default function TaskCard({ task, onStatusChange }: Props) {
  return (
    <article className="task-card">
      <div className="task-card-top">
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onStatusChange?.(task.id, e.target.value as Task['status'])}
          aria-label={`Change status for ${task.title}`}
        >
          <option value="todo">To do</option>
          <option value="progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <h4>{task.title}</h4>
      <p className="muted">{task.project}</p>

      <div className="task-meta">
        <span><CalendarDays size={15} /> {task.dueDate}</span>
        <span><UserRound size={15} /> {task.assignee}</span>
      </div>
    </article>
  )
}

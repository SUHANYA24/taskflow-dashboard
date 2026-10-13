import { useState } from 'react'
import type { Task } from '../types'
import TaskCard from '../components/TaskCard'
import { updateTask } from '../services/taskService'

interface Props {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

const columns: {
  key: Task['status']
  label: string
}[] = [
  { key: 'todo', label: 'To do' },
  { key: 'progress', label: 'In progress' },
  { key: 'done', label: 'Done' },
]

export default function Kanban({
  tasks,
  setTasks,
}: Props) {
  const [draggedTaskId, setDraggedTaskId] =
    useState<string | null>(null)

  const [dragOverColumn, setDragOverColumn] =
    useState<Task['status'] | null>(null)

  const updateStatus = async (
    id: string,
    status: Task['status'],
  ) => {
    const previousTasks = tasks

    // Update UI immediately
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status }
          : task,
      ),
    )

    try {
      const updated = await updateTask(id, {
        status,
      })

      setTasks((current) =>
        current.map((task) =>
          task.id === updated.id
            ? updated
            : task,
        ),
      )
    } catch (error) {
      console.error(
        'Failed to update task status:',
        error,
      )

      // Restore old state if Supabase fails
      setTasks(previousTasks)

      alert(
        'Could not update task status.',
      )
    }
  }

  const handleDragStart = (
    taskId: string,
  ) => {
    setDraggedTaskId(taskId)
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    status: Task['status'],
  ) => {
    e.preventDefault()
    setDragOverColumn(status)
  }

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    status: Task['status'],
  ) => {
    e.preventDefault()

    if (!draggedTaskId) return

    await updateStatus(
      draggedTaskId,
      status,
    )

    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  return (
    <div>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            KANBAN BOARD
          </p>

          <h1>Visual workflow</h1>

          <p className="muted">
            Drag tasks between columns to update
            their status.
          </p>
        </div>
      </section>

      <section className="kanban-grid">
        {columns.map((column) => {
          const columnTasks =
            tasks.filter(
              (task) =>
                task.status === column.key,
            )

          return (
            <div
              className={`kanban-column ${
                dragOverColumn === column.key
                  ? 'kanban-column-active'
                  : ''
              }`}
              key={column.key}
              onDragOver={(e) =>
                handleDragOver(
                  e,
                  column.key,
                )
              }
              onDrop={(e) =>
                handleDrop(
                  e,
                  column.key,
                )
              }
              onDragLeave={() =>
                setDragOverColumn(null)
              }
            >
              <div className="kanban-title">
                <h3>
                  {column.label}
                </h3>

                <span>
                  {columnTasks.length}
                </span>
              </div>

              <div className="kanban-stack">
                {columnTasks.length === 0 && (
                  <div className="kanban-empty">
                    Drop task here
                  </div>
                )}

                {columnTasks.map(
                  (task) => (
                    <div
                      key={task.id}
                      draggable
                      className={`kanban-task-wrapper ${
                        draggedTaskId ===
                        task.id
                          ? 'kanban-task-dragging'
                          : ''
                      }`}
                      onDragStart={() =>
                        handleDragStart(
                          task.id,
                        )
                      }
                      onDragEnd={
                        handleDragEnd
                      }
                    >
                      <TaskCard
                        task={task}
                        onStatusChange={
                          updateStatus
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
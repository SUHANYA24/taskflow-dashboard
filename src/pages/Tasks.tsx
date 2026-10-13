import { useMemo, useState } from 'react'
import {
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import TaskCard from '../components/TaskCard'
import type { Project, Task } from '../types'

import {
  createTask,
  deleteTask,
  updateTask,
} from '../services/taskService'

interface Props {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  projects: Project[]
}

export default function Tasks({
  tasks,
  setTasks,
  projects,
}: Props) {
  const [filter, setFilter] =
    useState<'all' | Task['status']>('all')

  const [query, setQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] =
    useState<Task | null>(null)

  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    project: projects[0]?.name || '',
    status: 'todo' as Task['status'],
    priority: 'Medium' as Task['priority'],
    dueDate: '',
    assignee: 'You',
  })

  const filtered = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch =
        filter === 'all' ||
        task.status === filter

      const queryMatch =
        `${task.title} ${task.project}`
          .toLowerCase()
          .includes(query.toLowerCase())

      return statusMatch && queryMatch
    })
  }, [tasks, filter, query])

  const resetForm = () => {
    setFormData({
      title: '',
      project: projects[0]?.name || '',
      status: 'todo',
      priority: 'Medium',
      dueDate: '',
      assignee: 'You',
    })

    setEditingTask(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const handleCloseModal = () => {
    resetForm()
    setShowModal(false)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const getProjectIdByName = (
    projectName: string,
  ) => {
    return (
      projects.find(
        (project) =>
          project.name === projectName,
      )?.id ?? null
    )
  }

  const updateStatus = async (
    id: string,
    status: Task['status'],
  ) => {
    try {
      const updated =
        await updateTask(id, {
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
        'Failed to update status:',
        error,
      )

      alert(
        'Could not update task status.',
      )
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)

    setFormData({
      title: task.title,
      project: task.project,
      status: task.status,
      priority: task.priority,
      dueDate:
        task.dueDate === 'No deadline'
          ? ''
          : task.dueDate,
      assignee: task.assignee,
    })

    setShowModal(true)
  }

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?',
    )

    if (!confirmed) return

    try {
      await deleteTask(id)

      setTasks((current) =>
        current.filter(
          (task) => task.id !== id,
        ),
      )
    } catch (error) {
      console.error(
        'Failed to delete task:',
        error,
      )

      alert('Could not delete task.')
    }
  }

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    if (!formData.title.trim()) return

    const projectId =
      getProjectIdByName(
        formData.project,
      )

    try {
      setSaving(true)

      if (editingTask) {
        const updated =
          await updateTask(
            editingTask.id,
            {
              title: formData.title,
              project: formData.project,
              status: formData.status,
              priority: formData.priority,
              dueDate:
                formData.dueDate ||
                'No deadline',
              assignee:
                formData.assignee ||
                'You',
            },
            projectId,
          )

        setTasks((current) =>
          current.map((task) =>
            task.id === updated.id
              ? updated
              : task,
          ),
        )
      } else {
        const created =
          await createTask(
            {
              title: formData.title,
              project: formData.project,
              status: formData.status,
              priority: formData.priority,
              dueDate:
                formData.dueDate ||
                'No deadline',
              assignee:
                formData.assignee ||
                'You',
            },
            projectId,
          )

        setTasks((current) => [
          created,
          ...current,
        ])
      }

      handleCloseModal()
    } catch (error) {
      console.error(
        'Failed to save task:',
        error,
      )

      alert(
        'Could not save task. Check your Supabase setup.',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            TASK MANAGEMENT
          </p>

          <h1>All tasks</h1>

          <p className="muted">
            Search, filter and update work
            from one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreateModal}
          disabled={projects.length === 0}
        >
          <Plus size={18} />
          Add task
        </button>
      </section>

      {projects.length === 0 && (
        <div className="card section-spaced">
          <h3>
            Create a project first
          </h3>

          <p className="muted">
            Tasks need to belong to a project,
            so create at least one project before
            adding tasks.
          </p>
        </div>
      )}

      <div className="toolbar card">
        <input
          className="input"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
        />

        <div className="filter-row">
          {(
            [
              'all',
              'todo',
              'progress',
              'done',
            ] as const
          ).map((item) => (
            <button
              className={`filter-btn ${
                filter === item
                  ? 'selected'
                  : ''
              }`}
              onClick={() =>
                setFilter(item)
              }
              key={item}
            >
              {item === 'all'
                ? 'All'
                : item === 'todo'
                ? 'To do'
                : item === 'progress'
                ? 'In progress'
                : 'Done'}
            </button>
          ))}
        </div>
      </div>

      <section className="task-grid section-spaced">
        {filtered.length === 0 && (
          <div className="card">
            <h3>No tasks found</h3>

            <p className="muted">
              Create a task or change your search
              and filters.
            </p>
          </div>
        )}

        {filtered.map((task) => (
          <div
            className="task-item-wrapper"
            key={task.id}
          >
            <TaskCard
              task={task}
              onStatusChange={updateStatus}
            />

            <div className="task-actions">
              <button
                className="edit-btn"
                onClick={() =>
                  handleEdit(task)
                }
                title="Edit task"
              >
                <Pencil size={17} />
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(task.id)
                }
                title="Delete task"
              >
                <Trash2 size={17} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingTask
                    ? 'Edit task'
                    : 'Add new task'}
                </h2>

                <p className="muted">
                  {editingTask
                    ? 'Update task details.'
                    : 'Create a task and assign it to a project.'}
                </p>
              </div>

              <button
                className="icon-btn"
                onClick={
                  handleCloseModal
                }
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Task title</label>

                <input
                  name="title"
                  value={formData.title}
                  onChange={
                    handleChange
                  }
                  placeholder="Example: Build login page"
                  required
                />
              </div>

              <div className="form-group">
                <label>Project</label>

                <select
                  name="project"
                  value={
                    formData.project
                  }
                  onChange={
                    handleChange
                  }
                  required
                >
                  {projects.map(
                    (project) => (
                      <option
                        key={project.id}
                        value={
                          project.name
                        }
                      >
                        {project.name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="todo">
                      To do
                    </option>

                    <option value="progress">
                      In progress
                    </option>

                    <option value="done">
                      Done
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={
                      formData.priority
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due date</label>

                <input
                  type="date"
                  name="dueDate"
                  value={
                    formData.dueDate
                  }
                  onChange={
                    handleChange
                  }
                />
              </div>

              <div className="form-group">
                <label>Assignee</label>

                <input
                  name="assignee"
                  value={
                    formData.assignee
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Example: You"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={
                    handleCloseModal
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingTask
                    ? 'Save changes'
                    : 'Add task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
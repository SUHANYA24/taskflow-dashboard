import { useState } from 'react'
import {
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'

import type { Project } from '../types'

import {
  createProject,
  deleteProject,
  updateProject,
} from '../services/projectService'

interface Props {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export default function Projects({
  projects,
  setProjects,
}: Props) {
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] =
    useState<Project | null>(null)

  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dueDate: '',
    })

    setEditingProject(null)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const handleCloseModal = () => {
    resetForm()
    setShowModal(false)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)

    setFormData({
      name: project.name,
      description: project.description,
      dueDate:
        project.dueDate === 'No deadline'
          ? ''
          : project.dueDate,
    })

    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?',
    )

    if (!confirmed) return

    try {
      await deleteProject(id)

      setProjects((current) =>
        current.filter(
          (project) => project.id !== id,
        ),
      )
    } catch (error) {
      console.error(
        'Failed to delete project:',
        error,
      )

      alert('Could not delete project.')
    }
  }

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    try {
      setSaving(true)

      if (editingProject) {
        const updated =
          await updateProject(
            editingProject.id,
            {
              name: formData.name,
              description:
                formData.description,
              dueDate:
                formData.dueDate ||
                'No deadline',
            },
          )

        setProjects((current) =>
          current.map((project) =>
            project.id === updated.id
              ? updated
              : project,
          ),
        )
      } else {
        const created =
          await createProject({
            name: formData.name,
            description:
              formData.description,
            progress: 0,
            members: 1,
            tasks: 0,
            dueDate:
              formData.dueDate ||
              'No deadline',
          })

        setProjects((current) => [
          created,
          ...current,
        ])
      }

      handleCloseModal()
    } catch (error) {
      console.error(
        'Failed to save project:',
        error,
      )

      alert(
        'Could not save project. Check your Supabase setup.',
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
            PROJECTS
          </p>

          <h1>Your projects</h1>

          <p className="muted">
            Track scope, progress,
            deadlines and team activity.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={openCreateModal}
        >
          <Plus size={18} />
          Create project
        </button>
      </section>

      <section className="project-grid">
        {projects.length === 0 && (
          <div className="card">
            <h3>No projects yet</h3>

            <p className="muted">
              Create your first project to get started.
            </p>
          </div>
        )}

        {projects.map((project) => (
          <article
            className="card project-card"
            key={project.id}
          >
            <div className="project-badge">
              {project.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <h3>{project.name}</h3>

            <p className="muted">
              {project.description ||
                'No description added yet.'}
            </p>

            <div className="project-stats">
              <span>
                <UsersRound size={16} />
                {project.members} members
              </span>

              <span>
                {project.tasks} tasks
              </span>
            </div>

            <div className="progress-label">
              <span>Progress</span>

              <strong>
                {project.progress}%
              </strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>

            <div className="project-footer">
              <span>
                <CalendarDays size={16} />
                Due {project.dueDate}
              </span>

              <div className="project-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    handleEdit(project)
                  }
                  title="Edit project"
                >
                  <Pencil size={17} />
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      project.id,
                    )
                  }
                  title="Delete project"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <h2>
                  {editingProject
                    ? 'Edit project'
                    : 'Create new project'}
                </h2>

                <p className="muted">
                  {editingProject
                    ? 'Update your project details.'
                    : 'Add a new project to your workspace.'}
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

            <form
              onSubmit={handleSubmit}
            >
              <div className="form-group">
                <label>
                  Project name
                </label>

                <input
                  name="name"
                  value={formData.name}
                  onChange={
                    handleChange
                  }
                  placeholder="Example: E-commerce Website"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Write a short project description..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>
                  Due date
                </label>

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
                    : editingProject
                    ? 'Save changes'
                    : 'Create project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
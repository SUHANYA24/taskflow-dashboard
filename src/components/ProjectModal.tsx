import { useState } from 'react'
import { X } from 'lucide-react'
import type { Project } from '../types'

interface Props {
  onClose: () => void
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export default function ProjectModal({ onClose, setProjects }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: formData.name,
      description: formData.description,
      progress: 0,
      members: 1,
      tasks: 0,
      dueDate: formData.dueDate || 'No deadline',
    }

    setProjects((current) => [...current, newProject])
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h2>Create new project</h2>
            <p className="muted">
              Add a new project to your workspace.
            </p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project name</label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: E-commerce Website"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short project description..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Due date</label>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
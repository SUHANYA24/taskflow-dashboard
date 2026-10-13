import { useState } from 'react'
import ProjectModal from '../components/ProjectModal'
import {
  CheckCircle2,
  Clock3,
  FolderKanban,
  ListTodo,
} from 'lucide-react'

import StatCard from '../components/StatCard'
import TaskCard from '../components/TaskCard'
import type { Project, Task } from '../types'

interface Props {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}

export default function Dashboard({
  projects,
  setProjects,
  tasks,
  setTasks,
}: Props) {
  const [showProjectModal, setShowProjectModal] = useState(false)

  const completed = tasks.filter(
    (task) => task.status === 'done',
  ).length

  const inProgress = tasks.filter(
    (task) => task.status === 'progress',
  ).length

  const updateStatus = (
    id: string,
    status: Task['status'],
  ) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status }
          : task,
      ),
    )
  }

  return (
    <div>
      <section className="page-heading">
        <div>
          <p className="eyebrow">
            WORKSPACE OVERVIEW
          </p>

          <h1>Good afternoon 👋</h1>

          <p className="muted">
            Here is what is happening across your
            projects today.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            setShowProjectModal(true)
          }
        >
          + New project
        </button>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Projects"
          value={projects.length}
          caption="Active workspaces"
          icon={FolderKanban}
        />

        <StatCard
          label="Total tasks"
          value={tasks.length}
          caption="Across all projects"
          icon={ListTodo}
        />

        <StatCard
          label="In progress"
          value={inProgress}
          caption="Currently being worked on"
          icon={Clock3}
        />

        <StatCard
          label="Completed"
          value={completed}
          caption="Nice progress"
          icon={CheckCircle2}
        />
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <div className="section-title">
            <div>
              <h2>Project progress</h2>

              <p className="muted">
                Current completion across active
                projects.
              </p>
            </div>
          </div>

          <div className="progress-list">
            {projects.map((project) => (
              <div
                className="progress-item"
                key={project.id}
              >
                <div className="progress-label">
                  <strong>
                    {project.name}
                  </strong>

                  <span>
                    {project.progress}%
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">
            <div>
              <h2>Upcoming deadlines</h2>

              <p className="muted">
                Tasks you may want to prioritize.
              </p>
            </div>
          </div>

          <div className="deadline-list">
            {tasks.slice(0, 4).map((task) => (
              <div
                className="deadline-row"
                key={task.id}
              >
                <div>
                  <strong>
                    {task.title}
                  </strong>

                  <p className="tiny">
                    {task.project}
                  </p>
                </div>

                <span className="date-chip">
                  {task.dueDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card section-spaced">
        <div className="section-title">
          <div>
            <h2>Recent tasks</h2>

            <p className="muted">
              Update task status directly from the
              dashboard.
            </p>
          </div>
        </div>

        <div className="task-grid">
          {tasks.slice(0, 3).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={updateStatus}
            />
          ))}
        </div>
      </section>

      {showProjectModal && (
        <ProjectModal
          onClose={() =>
            setShowProjectModal(false)
          }
          setProjects={setProjects}
        />
      )}
    </div>
  )
}
import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'

import Layout from './components/Layout'
import { useLocalStorage } from './hooks/useLocalStorage'
import { supabase } from './lib/supabase'

import { getProjects } from './services/projectService'
import { getTasks } from './services/taskService'
import { getProfile } from './services/profileService'

import Dashboard from './pages/Dashboard'
import Kanban from './pages/Kanban'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Projects from './pages/Projects'
import Settings from './pages/Settings'
import Tasks from './pages/Tasks'

import type { Project, Task } from './types'

export default function App() {
  const [projects, setProjects] =
    useState<Project[]>([])

  const [tasks, setTasks] =
    useState<Task[]>([])

  const [darkMode, setDarkMode] =
    useLocalStorage<boolean>(
      'taskflow-dark',
      false,
    )

  const [session, setSession] =
    useState<Session | null>(null)

  const [authLoading, setAuthLoading] =
    useState(true)

  const [dataLoading, setDataLoading] =
    useState(false)

  const [profileName, setProfileName] =
    useState('')

  const [profileEmail, setProfileEmail] =
    useState('')

  useEffect(() => {
    document.documentElement.dataset.theme =
      darkMode ? 'dark' : 'light'
  }, [darkMode])

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setAuthLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setAuthLoading(false)
      },
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const loadAppData = async () => {
      if (!session) {
        setProjects([])
        setTasks([])
        setProfileName('')
        setProfileEmail('')
        return
      }

      try {
        setDataLoading(true)

        const [projectData, taskData, profile] =
          await Promise.all([
            getProjects(),
            getTasks(),
            getProfile(),
          ])

        setProjects(projectData)
        setTasks(taskData)

        setProfileName(
          profile?.full_name ?? '',
        )

        setProfileEmail(
          session.user.email ?? '',
        )
      } catch (error) {
        console.error(
          'Failed to load app data:',
          error,
        )
      } finally {
        setDataLoading(false)
      }
    }

    loadAppData()
  }, [session])

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-card">
          <div className="brand-mark">
            T
          </div>

          <p>
            Loading TaskFlow...
          </p>
        </div>
      </div>
    )
  }

  if (session && dataLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-card">
          <div className="brand-mark">
            T
          </div>

          <p>
            Loading your workspace...
          </p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session ? (
            <Navigate
              to="/"
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        element={
          session ? (
            <Layout
              darkMode={darkMode}
              onToggleTheme={() =>
                setDarkMode(
                  (value) => !value,
                )
              }
              profileName={profileName}
              profileEmail={profileEmail}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      >
        <Route
          index
          element={
            <Dashboard
              projects={projects}
              setProjects={setProjects}
              tasks={tasks}
              setTasks={setTasks}
            />
          }
        />

        <Route
          path="/projects"
          element={
            <Projects
              projects={projects}
              setProjects={setProjects}
            />
          }
        />

        <Route
          path="/tasks"
          element={
            <Tasks
              tasks={tasks}
              setTasks={setTasks}
              projects={projects}
            />
          }
        />

        <Route
          path="/kanban"
          element={
            <Kanban
              tasks={tasks}
              setTasks={setTasks}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <Settings
              profileName={profileName}
              profileEmail={profileEmail}
              onProfileUpdated={
                setProfileName
              }
            />
          }
        />

        <Route
          path="*"
          element={<NotFound />}
        />
      </Route>
    </Routes>
  )
}
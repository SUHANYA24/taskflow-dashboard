import { supabase } from '../lib/supabase'
import type { Project } from '../types'

type ProjectRow = {
  id: string
  user_id: string
  name: string
  description: string | null
  progress: number
  members: number
  tasks: number
  due_date: string | null
  created_at: string
}

const mapProjectRow = (row: ProjectRow): Project => ({
  id: row.id,
  name: row.name,
  description: row.description ?? '',
  progress: row.progress,
  members: row.members,
  tasks: row.tasks,
  dueDate: row.due_date ?? 'No deadline',
})

export const getProjects = async (): Promise<Project[]> => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as ProjectRow[]).map(mapProjectRow)
}

export const createProject = async (
  project: Omit<Project, 'id'>,
): Promise<Project> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User is not authenticated')
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name: project.name,
      description: project.description,
      progress: project.progress,
      members: project.members,
      tasks: project.tasks,
      due_date:
        project.dueDate === 'No deadline'
          ? null
          : project.dueDate,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapProjectRow(data as ProjectRow)
}

export const updateProject = async (
  id: string,
  updates: Partial<Project>,
): Promise<Project> => {
  const payload: Record<string, unknown> = {}

  if (updates.name !== undefined) {
    payload.name = updates.name
  }

  if (updates.description !== undefined) {
    payload.description = updates.description
  }

  if (updates.progress !== undefined) {
    payload.progress = updates.progress
  }

  if (updates.members !== undefined) {
    payload.members = updates.members
  }

  if (updates.tasks !== undefined) {
    payload.tasks = updates.tasks
  }

  if (updates.dueDate !== undefined) {
    payload.due_date =
      updates.dueDate === 'No deadline'
        ? null
        : updates.dueDate
  }

  const { data, error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return mapProjectRow(data as ProjectRow)
}

export const deleteProject = async (
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
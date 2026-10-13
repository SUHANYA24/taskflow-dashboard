import { supabase } from '../lib/supabase'
import type { Task } from '../types'

type TaskRow = {
  id: string
  user_id: string
  project_id: string | null
  title: string
  status: Task['status']
  priority: Task['priority']
  due_date: string | null
  assignee: string | null
  created_at: string
}

type TaskRowWithProject = TaskRow & {
  projects?: {
    name: string
  } | null
}

const mapTaskRow = (row: TaskRowWithProject): Task => ({
  id: row.id,
  title: row.title,
  project: row.projects?.name ?? 'No project',
  status: row.status,
  priority: row.priority,
  dueDate: row.due_date ?? 'No deadline',
  assignee: row.assignee ?? 'You',
})

export const getTasks = async (): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      projects (
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data as TaskRowWithProject[]).map(mapTaskRow)
}

export const createTask = async (
  task: Omit<Task, 'id'>,
  projectId: string | null,
): Promise<Task> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User is not authenticated')
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      project_id: projectId,
      title: task.title,
      status: task.status,
      priority: task.priority,
      due_date:
        task.dueDate === 'No deadline'
          ? null
          : task.dueDate,
      assignee: task.assignee,
    })
    .select(`
      *,
      projects (
        name
      )
    `)
    .single()

  if (error) {
    throw error
  }

  return mapTaskRow(data as TaskRowWithProject)
}

export const updateTask = async (
  id: string,
  updates: Partial<Task>,
  projectId?: string | null,
): Promise<Task> => {
  const payload: Record<string, unknown> = {}

  if (updates.title !== undefined) {
    payload.title = updates.title
  }

  if (updates.status !== undefined) {
    payload.status = updates.status
  }

  if (updates.priority !== undefined) {
    payload.priority = updates.priority
  }

  if (updates.dueDate !== undefined) {
    payload.due_date =
      updates.dueDate === 'No deadline'
        ? null
        : updates.dueDate
  }

  if (updates.assignee !== undefined) {
    payload.assignee = updates.assignee
  }

  if (projectId !== undefined) {
    payload.project_id = projectId
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(payload)
    .eq('id', id)
    .select(`
      *,
      projects (
        name
      )
    `)
    .single()

  if (error) {
    throw error
  }

  return mapTaskRow(data as TaskRowWithProject)
}

export const deleteTask = async (
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
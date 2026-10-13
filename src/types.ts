export type TaskStatus = 'todo' | 'progress' | 'done'
export type Priority = 'Low' | 'Medium' | 'High'

export interface Task {
  id: string
  title: string
  project: string
  status: TaskStatus
  priority: Priority
  dueDate: string
  assignee: string
}

export interface Project {
  id: string
  name: string
  description: string
  progress: number
  members: number
  tasks: number
  dueDate: string
}
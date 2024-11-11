import { useState, useEffect } from 'react'
import api from '../api/api-instance' // Adjust the import as needed
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export interface ITask {
  id: string // Unique task identifier
  store_name: string // Store or location of the task
  description: string // Task description
  completed_by?: string // Worker who completed the task (if completed)
  completed_at?: string // Completion timestamp
  created_at: string // Task creation timestamp
  status: 'pending' | 'completed' // Task status (pending or completed)
}

export const useFetchTasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get('/tasks')
        setTasks(response.data)
      } catch (error) {
        setError('Failed to fetch tasks.')
        toast.error('Error fetching tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return { tasks, loading, error }
}

export const useFetchTaskById = (taskId: string) => {
  const [task, setTask] = useState<ITask | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/task/${taskId}`)
        setTask(response.data)
      } catch (error) {
        setError('Failed to fetch task.')
        toast.error('Error fetching task')
      } finally {
        setLoading(false)
      }
    }

    if (taskId) {
      fetchTask()
    }
  }, [taskId])

  return { task, loading, error }
}

export const useAddTask = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addTask = async (task: Omit<ITask, 'id' | 'created_at' | 'status'>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.post('/tasks', task)
      toast.success('Task added successfully')
      return response.data
    } catch (error) {
      setError('Failed to add task.')
      toast.error('Error adding task')
    } finally {
      setLoading(false)
    }
  }

  return { addTask, loading, error }
}

export const useDeleteTask = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTask = async (taskId: string) => {
    try {
      setLoading(true)
      setError(null)
      await api.delete(`/tasks/${taskId}`)
      toast.success('Task deleted successfully')
    } catch (error) {
      setError('Failed to delete task.')
      toast.error('Error deleting task')
    } finally {
      setLoading(false)
    }
  }

  return { deleteTask, loading, error }
}

export const useUpdateTask = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const updateTask = async (taskId: string, updatedData: Partial<ITask>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.put(`/tasks/${taskId}`, updatedData)
      toast.success('Task updated successfully')
      return response.data
    } catch (error) {
      setError('Failed to update task.')
      toast.error('Error updating task')
    } finally {
      setLoading(false)
    }
  }

  return { updateTask, loading, error }
}

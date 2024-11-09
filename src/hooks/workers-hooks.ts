import { useState, useEffect } from 'react'
import api from '../api/api-instance'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export interface Worker {
  id: string // Change id type to string
  name: string
  firstName: string
  age: number
  position: string
  hours_to_work: string
  monthly_salary: string
  is_working: boolean
  monthly_worked_minutes: number
  qr_code_text: string
}

export const useFetchWorkers = () => {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get('/workers')
        setWorkers(response.data)
      } catch (error) {
        setError('Failed to fetch workers. Please try again later.')
        toast.error('Error fetching workers')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

  return { workers, loading, error }
}

export const useAddWorker = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addWorker = async (worker: Worker) => {
    try {
      setLoading(true)
      setError(null)
      await api.post('/workers', worker)
      toast.success('Worker added successfully')
    } catch (error) {
      setError('Failed to add worker. Please try again later.')
      toast.error('Error adding worker')
    } finally {
      setLoading(false)
    }
  }

  return { addWorker, loading, error }
}

export const useUpdateWorker = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Add error state

  const updateWorker = async (
    id: string,
    updatedWorkerData: Partial<Worker>
  ) => {
    setLoading(true)
    try {
      const response = await api.put<Worker>(
        `/workers/${id}`,
        updatedWorkerData
      )
      toast.success('Worker updated successfully')
      return response.data
    } catch (error) {
      setError('Failed to update worker. Please try again later.') // Set error state
      toast.error('Error updating worker')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { updateWorker, loading, error } // Return error state
}

export const useDeleteWorker = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // Add error state

  const deleteWorker = async (id: string) => {
    setLoading(true)
    try {
      await api.delete(`/workers/${id}`)
      toast.success('Worker deleted successfully')
    } catch (error) {
      setError('Failed to delete worker. Please try again later.') // Set error state
      toast.error('Error deleting worker')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { deleteWorker, loading, error } // Return error state
}

export const useFetchWorkerById = (id: string) => {
  const [worker, setWorker] = useState<Worker | null>(null) // Worker state
  const [loading, setLoading] = useState<boolean>(true) // Loading state
  const [error, setError] = useState<string | null>(null) // Error state

  useEffect(() => {
    const fetchWorkerById = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/workers/${id}`)
        setWorker(response.data) // Set worker data
      } catch (error) {
        setError('Failed to fetch worker. Please try again later.')
        toast.error('Error fetching worker')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchWorkerById() // Fetch worker data when ID is available
    }
  }, [id]) // Dependency on ID to refetch when it changes

  return { worker, loading, error }
}

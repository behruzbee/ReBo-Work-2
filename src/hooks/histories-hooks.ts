import { useState, useEffect } from 'react'
import api from '../api/api-instance'
import { toast } from 'react-toastify'

export interface History {
  worker_id: string
  qr_code_text: string
  work_place_name: string
  scan_time: string
}

export const useFetchHistories = (workerId?: string) => {
  const [histories, setHistories] = useState<History[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true)
        setError(null)
        let url = '/histories' // Default to fetch all histories
        if (workerId) {
          url = `/histories/worker/${workerId}`
        }

        const response = await api.get(url)
        setHistories(response.data)
      } catch (error) {
        setError('Failed to fetch histories. Please try again later.')
        toast.error('Error fetching histories')
      } finally {
        setLoading(false)
      }
    }

    fetchHistories()
  }, [workerId])

  return { histories, loading, error }
}

export const useAddHistory = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addHistory = async (history: {
    worker_id: string
    qr_code_text: string
    work_place_name: string
    scan_time: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      await api.post('/histories', history)
      toast.success('History added successfully')
    } catch (error) {
      setError('Failed to add history. Please try again later.')
      toast.error('Error adding history')
    } finally {
      setLoading(false)
    }
  }

  return { addHistory, loading, error }
}

export const useFetchWorkerHistories = (id: string) => {
  const [histories, setHistories] = useState<History[] | null>(null) // Histories state
  const [loading, setLoading] = useState<boolean>(true) // Loading state
  const [error, setError] = useState<string | null>(null) // Error state

  useEffect(() => {
    const fetchWorkerHistories = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await api.get(`/histories/worker/${id}`)
        setHistories(response.data) // Set histories data
      } catch (error) {
        setError('Failed to fetch worker histories. Please try again later.')
        toast.error('Error fetching worker histories') // Show error notification
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchWorkerHistories() // Fetch histories data when ID is available
    }
  }, [id]) // Dependency on ID to refetch when it changes

  return { histories, loading, error }
}

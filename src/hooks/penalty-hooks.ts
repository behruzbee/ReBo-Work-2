import { useState, useEffect } from 'react'
import api from '../api/api-instance'
import { toast } from 'react-toastify'

export interface Penalty {
  id: string
  worker_id: string
  description: string
  amount: number
  time: string
}

export const useFetchPenalties = (workerId?: string) => {
  const [penalties, setPenalties] = useState<Penalty[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        setLoading(true)
        setError(null)
        let url = '/penalties' // Default to fetch all penalties
        if (workerId) {
          url = `/penalties/worker/${workerId}` // Fetch penalties for a specific worker
        }

        const response = await api.get(url)
        setPenalties(response.data)
      } catch (error) {
        setError('Failed to fetch penalties. Please try again later.')
        toast.error('Error fetching penalties')
      } finally {
        setLoading(false)
      }
    }

    fetchPenalties()
  }, [workerId])

  return { penalties, loading, error }
}

export const useAddPenalty = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const addPenalty = async (penalty: {
    worker_id: string
    description: string
    amount: number
  }) => {
    try {
      setLoading(true)
      setError(null)

      // Добавляем текущую дату в поле "time"
      const penaltyWithTime = {
        ...penalty,
        time: new Date().toISOString() // Форматируем время в ISO строку
      }

      // Отправляем запрос на сервер
      await api.post('/penalties', penaltyWithTime)

      toast.success('Penalty created successfully!')
      return true
    } catch (error) {
      setError('Failed to create penalty. Please try again later.')
      toast.error('Error creating penalty')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { addPenalty, loading, error }
}

export const useDeletePenalty = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const deletePenalty = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await api.delete(`/penalties/${id}`)
      return true // Возвращаем true, если удаление прошло успешно
    } catch (error) {
      setError('Failed to delete penalty. Please try again later.')
      return false // Возвращаем false в случае ошибки
    } finally {
      setLoading(false)
    }
  }

  return { deletePenalty, loading, error }
}

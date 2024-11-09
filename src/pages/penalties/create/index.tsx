import { useState } from 'react'
import { useAddPenalty } from '../../../hooks/penalty-hooks'
import { useFetchWorkers } from '../../../hooks/workers-hooks' // Импортируем хук для работников
import { toast } from 'react-toastify'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'

const PenaltyCreatePage = () => {
    const navigate = useNavigate()
    const { addPenalty, loading, error } = useAddPenalty()
    const { workers, loading: workersLoading, error: workersError } = useFetchWorkers()

    const [penalty, setPenalty] = useState({
        worker_id: '',
        description: '',
        amount: 0,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPenalty({ ...penalty, [name]: value })
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPenalty({ ...penalty, worker_id: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Преобразуем amount в число перед отправкой
        const penaltyData = {
            ...penalty,
            amount: parseFloat(penalty.amount.toString()), // Убедитесь, что это число
        }

        const success = await addPenalty(penaltyData)

        if (success) {
            toast.success('Penalty created successfully!')
            navigate('/penalties')
        } else {
            toast.error('Failed to create penalty.')
        }
    }

    return (
        <div className={styles.penaltyCreatePage}>
            <h1>Create Penalty</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="worker_id">Ishchini tanlang</label>
                    <select
                        id="worker_id"
                        name="worker_id"
                        value={penalty.worker_id}
                        onChange={handleSelectChange}
                        required
                        disabled={workersLoading}
                        className={styles.selectField}
                    >
                        <option value="" disabled>Ishchilar</option>
                        {workers.map((worker) => (
                            <option key={worker.id} value={worker.id}>
                                {worker.name}
                            </option>
                        ))}
                    </select>
                    {workersLoading && <div className={styles.loader}>Loading workers...</div>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="description">Izoh</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={penalty.description}
                        onChange={handleInputChange}
                        required
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="amount">Summa</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={penalty.amount}
                        onChange={handleInputChange}
                        required
                        className={styles.inputField}
                    />
                </div>

                <button type="submit" className={`${styles.submitBtn} ${loading ? styles.disabled : ''}`} disabled={loading}>
                    {loading ? 'Creating...' : 'Create Penalty'}
                </button>
            </form>
            {error && <div className={styles.error}>{error}</div>}
            {workersError && <div className={styles.error}>{workersError}</div>}
        </div>
    )
}

export default PenaltyCreatePage

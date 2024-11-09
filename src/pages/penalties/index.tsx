import { useEffect, useState } from 'react'
import { useFetchPenalties, useDeletePenalty, Penalty } from '../../hooks/penalty-hooks'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.scss'
import { useFetchWorkers } from '../../hooks/workers-hooks' // Importing the workers hook

const PenaltiesPage = () => {
    const { penalties, loading, error } = useFetchPenalties()
    const { deletePenalty, loading: deleteLoading, error: deleteError } = useDeletePenalty()
    const { workers, loading: workersLoading } = useFetchWorkers() // Fetch workers data
    const [penaltyData, setPenaltyData] = useState<Penalty[]>([])
    const [workerNames, setWorkerNames] = useState<Record<string, string>>({}) // Map worker ID to name
    const navigate = useNavigate()

    useEffect(() => {
        if (penalties) {
            setPenaltyData(penalties)
        }
    }, [penalties])

    // Populate worker names after fetching workers
    useEffect(() => {
        if (workers && workers.length > 0) {
            const workerNameMap: Record<string, string> = {}
            workers.forEach(worker => {
                workerNameMap[worker.id] = `${worker.firstName} ${worker.name}`
            })
            setWorkerNames(workerNameMap)
        }
    }, [workers])

    const handleDelete = async (id: string) => {
        const success = await deletePenalty(id)
        if (success) {
            toast.success('Penalty deleted successfully!')
        } else {
            toast.error('Failed to delete penalty.')
        }
    }

    const handleNavigateToCreate = () => {
        navigate('/penalties/create')  // Navigate to create penalty page
    }

    if (loading || workersLoading) {
        return <div className={styles.loading}>Loading...</div>
    }

    return (
        <div className={styles.penaltiesPage}>
            <h1>Jarimalar</h1>
            <button
                className={styles.createBtn}
                onClick={handleNavigateToCreate}
            >
                Jarima qo'shish
            </button>

            {error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.penaltiesTable}>
                        <thead>
                            <tr>
                                <th>Jarima ID</th>
                                <th>Ishchi ismi</th> {/* Changed to "Ishchi ismi" */}
                                <th>Sabab</th>
                                <th>Summa</th>
                                <th>Vaqt</th>
                                <th>Harakatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penaltyData.map((penalty) => (
                                <tr key={penalty.id} className={styles.penaltyRow}>
                                    <td>{penalty.id}</td>
                                    <td>{workerNames[penalty.worker_id] || 'Loading...'}</td> {/* Display worker's name */}
                                    <td>{penalty.description}</td>
                                    <td>{penalty.amount} so'm</td>
                                    <td>{penalty.time}</td>
                                    <td>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(penalty.id)}
                                            disabled={deleteLoading}
                                        >
                                            {deleteLoading ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {deleteError && <div className={styles.deleteError}>{deleteError}</div>}
        </div>
    )
}

export default PenaltiesPage

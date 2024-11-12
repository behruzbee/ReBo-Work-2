import { useEffect, useState } from 'react'
import { useFetchPenalties, Penalty } from '../../hooks/penalty-hooks'
import styles from './styles.module.scss'
import { useFetchWorkers } from '../../hooks/workers-hooks' // Importing the workers hook
import { format } from 'date-fns'

const PenaltiesPublicPage = () => {
    const { penalties, loading, error } = useFetchPenalties()
    const { workers, loading: workersLoading } = useFetchWorkers() // Fetch workers data
    const [penaltyData, setPenaltyData] = useState<Penalty[]>([])
    const [workerNames, setWorkerNames] = useState<Record<string, string>>({}) // Map worker ID to name

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

    const formatScanTime = (scanTime: string) => {
        return format(new Date(scanTime), 'dd MMM yyyy, HH:mm');
    };

    if (loading || workersLoading) {
        return <div className={styles.loading}>Loading...</div>
    }

    return (
        <div className={styles.penaltiesPage}>
            <h1>Jarimalar</h1>

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
                            </tr>
                        </thead>
                        <tbody>
                            <h2 style={{marginTop: '20px', marginLeft: '20px'}}>{penaltyData.length === 0 && 'Jarimalar yo\'q'}</h2>
                            {penaltyData.map((penalty) => (
                                <tr key={penalty.id} className={styles.penaltyRow}>
                                    <td>{penalty.id}</td>
                                    <td>{workerNames[penalty.worker_id] || 'Loading...'}</td> {/* Display worker's name */}
                                    <td>{penalty.description}</td>
                                    <td>{penalty.amount} so'm</td>
                                    <td>{formatScanTime(penalty.time)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default PenaltiesPublicPage

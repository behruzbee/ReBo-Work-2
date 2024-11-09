import { useFetchWorkerById } from '../../../hooks/workers-hooks';
import { useFetchWorkerHistories } from '../../../hooks/histories-hooks';
import { useFetchPenalties } from '../../../hooks/penalty-hooks';  // Import the penalties hook
import styles from './styles.module.scss';
import { useParams } from 'react-router-dom';

const WorkerPage = () => {
    const { id } = useParams<{ id: string }>();
    const { worker, loading: workerLoading, error: workerError } = useFetchWorkerById(id || '');
    const { histories, loading: historiesLoading, error: historiesError } = useFetchWorkerHistories(id || '');
    const { penalties, loading: penaltiesLoading, error: penaltiesError } = useFetchPenalties(id);  // Fetch penalties

    if (workerLoading || historiesLoading || penaltiesLoading) {
        return <div className={styles.loader}>Loading...</div>;
    }

    if (workerError) {
        return <div className={styles.errorMessage}>Error: {workerError || historiesError || penaltiesError}</div>;
    }

    return (
        <div className={styles.workerPage}>
            {worker && (
                <div className={styles.workerCard}>
                    <h2>Ishchi Malumotlari</h2>
                    <table className={styles.workerTable}>
                        <tbody>
                            <tr><td><strong>Ism:</strong></td><td>{worker.name}</td></tr>
                            <tr><td><strong>Familya:</strong></td><td>{worker.firstName}</td></tr>
                            <tr><td><strong>Yosh:</strong></td><td>{worker.age} yosh</td></tr>
                            <tr><td><strong>Lavozim:</strong></td><td>{worker.position}</td></tr>
                            <tr><td><strong>Ish soati:</strong></td><td>{worker.hours_to_work} soat</td></tr>
                            <tr><td><strong>Oylik Maoshi:</strong></td><td>{worker.monthly_salary}</td></tr>
                            <tr><td><strong>Hozirgi ish status:</strong></td><td>{worker.is_working ? 'Ishda' : 'Ishda emas'}</td></tr>
                            <tr><td><strong>Ishlagan minuti shu oy:</strong></td><td>{worker.monthly_worked_minutes}</td></tr>
                            <tr><td><strong>QR Code:</strong></td><td>{worker.qr_code_text}</td></tr>
                        </tbody>
                    </table>
                </div>
            )}

            {histories && histories.length > 0 ? (
                <div className={styles.historySection}>
                    <h2>Istoriyalari</h2>
                    <table className={styles.historyTable}>
                        <thead>
                            <tr>
                                <th>Ish joyi nomi</th>
                                <th>QR Code</th>
                                <th>Skanerlangan vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.map((history, index) => (
                                <tr key={index} className={styles.historyRow}>
                                    <td>{history.work_place_name}</td>
                                    <td>{history.qr_code_text}</td>
                                    <td>{new Date(history.scan_time).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.noHistory}>No work history available for this worker.</div>
            )}

            {/* Display penalties if available */}
            {penalties && penalties.length > 0 ? (
                <div className={styles.penaltiesSection}>
                    <h2>Shtraflar</h2>
                    <table className={styles.penaltiesTable}>
                        <thead>
                            <tr>
                                <th>Izoh</th>
                                <th>Summa</th>
                                <th>Vaqt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {penalties.map((penalty) => (
                                <tr key={penalty.id} className={styles.penaltyRow}>
                                    <td>{penalty.description}</td>
                                    <td>{penalty.amount} so'm</td>
                                    <td>{new Date(penalty.time).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.noPenalties}>No penalties found for this worker.</div>
            )}
        </div>
    );
};

export default WorkerPage;
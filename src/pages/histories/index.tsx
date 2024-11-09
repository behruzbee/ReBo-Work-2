import { useState, useEffect } from 'react';
import { useFetchHistories } from '../../hooks/histories-hooks';
import { format } from 'date-fns';
import styles from './styles.module.scss';
import instance from '../../api/api-instance';
import { toast } from 'react-toastify';
import { useFetchWorkers } from '../../hooks/workers-hooks'; // Импортируем хук для работников

const HistoriesPage = () => {
    const { histories, loading, error } = useFetchHistories();
    const { workers, loading: workersLoading } = useFetchWorkers(); // Removed workersError

    const [workerNames, setWorkerNames] = useState<Record<string, string>>({});
    const [, setLoadingWorkerNames] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [workerId, setWorkerId] = useState('');
    const [qrCodeText, setQrCodeText] = useState('');
    const [workPlaceName, setWorkPlaceName] = useState('');
    const [scanTime, setScanTime] = useState('');

    const fetchWorkerName = async (workerId: string) => {
        try {
            setLoadingWorkerNames(true);
            const response = await instance.get(`/workers/${workerId}`);
            setWorkerNames((prevNames) => ({
                ...prevNames,
                [workerId]: `${response.data.firstName} ${response.data.name}`,
            }));
        } catch (error) {
            console.error('Failed to fetch worker:', error);
        } finally {
            setLoadingWorkerNames(false);
        }
    };

    useEffect(() => {
        if (histories.length > 0) {
            histories.forEach((history) => {
                if (!workerNames[history.worker_id]) {
                    fetchWorkerName(history.worker_id);
                }
            });
        }
    }, [histories, workerNames]);

    const formatScanTime = (scanTime: string) => {
        return format(new Date(scanTime), 'dd MMM yyyy, HH:mm');
    };

    const handleAddHistory = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newHistory = {
                worker_id: workerId,
                qr_code_text: qrCodeText,
                work_place_name: workPlaceName,
                scan_time: scanTime || new Date().toISOString(),
            };

            await instance.post('/histories', newHistory);
            toast.success('History added successfully!'); // Успешное уведомление
            setIsModalOpen(false); // Закрываем модальное окно после успешной отправки
        } catch (error) {
            toast.error('Failed to add history. Please try again.'); // Ошибка
            console.error('Failed to add history:', error);
        }
    };

    if (loading) {
        return <p className={styles.loading}>Istoriya yuklanmoqda...</p>;
    }

    return (
        <div className={styles.historiesPageWrapper}>
            <h2 className={styles.pageTitle}>Istoriyalar</h2>
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.openModalButton} onClick={() => setIsModalOpen(true)}>
                Yengi istoriya ochish
            </button>

            {workersLoading ? (
                <p className={styles.loading}>Ishchilar yuklanmoqda...</p>
            ) : (
                <table className={styles.historyTable}>
                    <thead>
                        <tr>
                            <th>Ishchi ismi</th>
                            <th>QR Code</th>
                            <th>Ishlavotgan joyi</th>
                            <th>Skanerlangan vaqt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories.map((history) => (
                            <tr key={history.worker_id}>
                                <td>{workerNames[history.worker_id] || 'Loading...'}</td>
                                <td>{history.qr_code_text}</td>
                                <td>{history.work_place_name}</td>
                                <td>{formatScanTime(history.scan_time)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h3>Yengi Istoriya qo'shish</h3>
                        <form onSubmit={handleAddHistory}>
                            <div className={styles.formGroup}>
                                <label htmlFor="worker_id">Ishchini tanlang</label>
                                <select
                                    id="worker_id"
                                    name="worker_id"
                                    value={workerId}
                                    onChange={(e) => setWorkerId(e.target.value)}
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
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="qr_code_text">QR Code</label>
                                <input
                                    type="text"
                                    id="qr_code_text"
                                    name="qr_code_text"
                                    value={qrCodeText}
                                    onChange={(e) => setQrCodeText(e.target.value)}
                                    required
                                    className={styles.inputField}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="work_place_name">Ishlavotgan joyi</label>
                                <input
                                    type="text"
                                    id="work_place_name"
                                    name="work_place_name"
                                    value={workPlaceName}
                                    onChange={(e) => setWorkPlaceName(e.target.value)}
                                    required
                                    className={styles.inputField}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="scan_time">Skanerlangan Vaqt</label>
                                <input
                                    type="datetime-local"
                                    id="scan_time"
                                    name="scan_time"
                                    value={scanTime}
                                    onChange={(e) => setScanTime(e.target.value)}
                                    className={styles.inputField}
                                />
                            </div>

                            <button type="submit" className={`${styles.submitBtn} ${workersLoading ? styles.disabled : ''}`} disabled={workersLoading}>
                                Istoriya qo'shmoq
                            </button>
                            <button type="button" onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                                Yopish
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HistoriesPage;

import { useState, useEffect } from 'react';
import { useFetchHistories } from '../../hooks/histories-hooks';
import { format } from 'date-fns';
import styles from './styles.module.scss';
import instance from '../../api/api-instance';
import { toast } from 'react-toastify';

const HistoriesPage = () => {
    const { histories, loading, error } = useFetchHistories();

    const [workerNames, setWorkerNames] = useState<Record<string, string>>({});
    const [loadingWorkerNames, setLoadingWorkerNames] = useState(false);

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

            {loadingWorkerNames ? (
                <p className={styles.loading}>Ishchi nomi yuklanmoqda...</p>
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
                            <input
                                type="text"
                                placeholder="Worker ID"
                                value={workerId}
                                onChange={(e) => setWorkerId(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="QR Code Text"
                                value={qrCodeText}
                                onChange={(e) => setQrCodeText(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Work Place Name"
                                value={workPlaceName}
                                onChange={(e) => setWorkPlaceName(e.target.value)}
                                required
                            />
                            <input
                                type="datetime-local"
                                value={scanTime}
                                onChange={(e) => setScanTime(e.target.value)}
                            />
                            <button type="submit">Yengi Istoriya qo'shish</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>
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
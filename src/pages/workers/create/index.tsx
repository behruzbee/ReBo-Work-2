import { useState, useRef, useEffect } from 'react';
import { useAddWorker } from '../../../hooks/workers-hooks';
import styles from './styles.module.scss';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode'; // Import the qrcode library
import { useNavigate } from 'react-router-dom';

const CreateWorkerPage = () => {
    const navigate = useNavigate();
    const [worker, setWorker] = useState({
        id: uuidv4(),
        name: '',
        firstName: '',
        age: 0,
        position: '',
        monthly_salary: '',
        monthly_worked_minutes: 0,
        qr_code_text: '',
        hours_to_work: '12',
        is_working: false
    });

    const { addWorker, loading: addingWorker, error } = useAddWorker();

    const qrCodeRef = useRef<HTMLCanvasElement | null>(null); // Reference for the QR code canvas

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const newValue = name === 'age' || name === 'monthly_salary' || name === 'hours_to_work'
            ? Number(value) || 0
            : value;

        setWorker((prevWorker) => ({
            ...prevWorker,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addWorker(worker);
        navigate('/workers');
        setWorker({
            id: uuidv4(),
            name: '',
            firstName: '',
            age: 0,
            position: '',
            monthly_salary: '',
            monthly_worked_minutes: 0,
            qr_code_text: '',
            hours_to_work: '12',
            is_working: false
        });
    };

    const handleDownloadQRCode = () => {
        if (qrCodeRef.current) {
            const canvas = qrCodeRef.current;
            const pngDataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngDataUrl;
            link.download = `${worker.qr_code_text}.png`;
            link.click();
        }
    };

    const generateQRCode = async () => {
        if (worker.qr_code_text) {
            try {
                // Generate QR code as a PNG image and draw it onto the canvas
                const qrCodeDataUrl = await QRCode.toDataURL(worker.qr_code_text, { type: 'png' });
                const canvas = qrCodeRef.current;
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    const img = new Image();
                    img.src = qrCodeDataUrl;
                    img.onload = () => {
                        ctx?.drawImage(img, 0, 0);
                    };
                }
            } catch (error) {
                console.error('Error generating QR code:', error);
            }
        }
    };

    // Re-generate the QR code every time the qr_code_text changes
    useEffect(() => {
        generateQRCode();
    }, [worker.qr_code_text]);

    return (
        <div className={styles.createWorkerWrapper}>
            <h1>Yengi ishchi qo'shish</h1>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="firstName">Ism</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={worker.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Familya</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={worker.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="position">Lavozim</label>
                    <input
                        type="text"
                        id="position"
                        name="position"
                        value={worker.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="age">Yosh</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={worker.age}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="monthly_salary">Oylik maosh</label>
                    <input
                        type="number"
                        id="monthly_salary"
                        name="monthly_salary"
                        value={worker.monthly_salary}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="hours_to_work">Ish soati</label>
                    <input
                        type="number"
                        id="hours_to_work"
                        name="hours_to_work"
                        value={worker.hours_to_work}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="qr_code_text">QR Code</label>
                    <input
                        type="text"
                        id="qr_code_text"
                        name="qr_code_text"
                        value={worker.qr_code_text}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* QR Code Canvas */}
                <div className={styles.qrCodeWrapper}>
                    <canvas ref={qrCodeRef} width="128" height="128" />
                </div>

                {/* Button to download QR Code */}
                <div className={styles.formGroup}>
                    <button type="button" onClick={handleDownloadQRCode}>
                        Yuklab olish QR Code
                    </button>
                </div>

                <div className={styles.formGroup}>
                    <button type="submit" disabled={addingWorker}>
                        {addingWorker ? 'Qo\'shilmoqda...' : 'Qo\'shish'}
                    </button>
                </div>
            </form>

            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default CreateWorkerPage;
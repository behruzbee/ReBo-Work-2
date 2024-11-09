import { useState, useRef } from 'react';
import { useAddWorker } from '../../../hooks/workers-hooks';
import styles from './styles.module.scss';
import { v4 as uuidv4 } from 'uuid';  // For unique ID generation
import ReactQRCode from 'react-qr-code';  // Importing the new library
import { useNavigate } from 'react-router-dom';

const CreateWorkerPage = () => {
    const navigate = useNavigate()
    const [worker, setWorker] = useState({
        id: uuidv4(),  // Generate a unique ID
        name: '',
        firstName: '',
        age: 0,  // Ensure age is initialized as a number
        position: '',
        monthly_salary: '',
        monthly_worked_minutes: 0,
        qr_code_text: '',
        hours_to_work: '12',
        is_working: false  // Added default value for hours_to_work
    });

    const { addWorker, loading: addingWorker, error } = useAddWorker();

    const qrCodeRef = useRef<SVGSVGElement | null>(null); // Reference for the QR code SVG

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Ensure age is treated as a number
        const newValue = name === 'age' || name === 'monthly_salary' || name === 'hours_to_work'
            ? Number(value) || 0  // Convert value to number, fallback to 0 if invalid
            : value;

        setWorker((prevWorker) => ({
            ...prevWorker,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addWorker(worker);
        navigate('/workers')
        setWorker({
            id: uuidv4(), // Reset ID for the new worker
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
            const svg = qrCodeRef.current;

            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (ctx) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const img = new Image();
                img.onload = () => {
                    // Draw the image (QR code) on the canvas
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Convert canvas to PNG and trigger download
                    const pngDataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.href = pngDataUrl;
                    link.download = `${worker.qr_code_text}.png`; // File name is the QR code text
                    link.click();
                };

                // Convert the SVG string to a data URL and load it as an image
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            }
        }
    };

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
                {/* Displaying the QR Code */}
                <div className={styles.qrCodeWrapper}>
                    {worker.qr_code_text && (
                        <ReactQRCode
                            value={worker.qr_code_text}
                            size={128}
                            ref={qrCodeRef}
                        />
                    )}
                </div>

                {/* Button to download the QR code */}
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

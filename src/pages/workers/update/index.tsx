import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ReactQRCode from 'react-qr-code'
import { useUpdateWorker, useFetchWorkerById, Worker } from '../../../hooks/workers-hooks'
import styles from './styles.module.scss'

// Helper function to convert and validate age
const convertToNumber = (value: string): number | null => {
  const numericValue = Number(value);
  return isNaN(numericValue) || numericValue <= 0 ? null : numericValue;
};

const UpdateWorkerPage = () => {
  const { id } = useParams<{ id: string }>() // Get the worker ID from the URL params
  const navigate = useNavigate() // For redirecting after successful update
  const { updateWorker, loading: updating, error: updateError } = useUpdateWorker()
  const { worker, loading: fetching, error: fetchError } = useFetchWorkerById(id || '')

  const [updatedWorker, setUpdatedWorker] = useState<Worker | null>(null)
  const qrCodeRef = useRef<SVGSVGElement>(null) // Ref to the QR code SVG

  useEffect(() => {
    if (worker) {
      setUpdatedWorker(worker) // Set worker data when fetched
    }
  }, [worker])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Handle age conversion and validation
    if (name === "age") {
      const age = convertToNumber(value);
      if (age === null) {
        toast.error("Age must be a valid positive number.");
        return;
      }
      setUpdatedWorker((prev) => ({
        ...prev!,
        [name]: age,
      }));
      return; // Skip further processing for age
    }

    // For other fields, just update the state normally
    setUpdatedWorker((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure name and first name are non-empty
    if (!updatedWorker?.name || !updatedWorker?.firstName) {
      toast.error("Both Name and First Name are required.");
      return;
    }

    // Ensure age is a valid positive number
    if (updatedWorker?.age === null || updatedWorker?.age <= 0) {
      toast.error("Age must be a valid positive number.");
      return;
    }

    if (updatedWorker) {
      try {
        await updateWorker(id || '', updatedWorker); // Use the updateWorker hook to send updated data
        navigate('/workers'); // Redirect to workers list page after successful update
      } catch (error) {
        console.error(error); // Log any error that occurs during the update
      }
    }
  };

  // Function to handle downloading the QR code as an image
  const handleDownloadQRCode = () => {
    if (qrCodeRef.current) {
      const svg = qrCodeRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const img = new Image();

      // Convert the SVG to a canvas element
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        // Convert the canvas to a data URL (PNG format)
        const dataUrl = canvas.toDataURL('image/png');

        // Create an anchor tag to trigger the download
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${updatedWorker?.firstName}_${updatedWorker?.name}_QRCode.png`;
        link.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData); // Convert SVG to base64-encoded string
    }
  };

  if (fetching) return <div>Loading...</div>; // Show loading until worker data is fetched
  if (fetchError) return <div>{fetchError}</div>; // Show fetch error if any

  return (
    <div className={styles.updateWorkerWrapper}>
      <h1>Update Worker</h1>
      <form className={`${styles.form} fade-in`} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">Ism</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={updatedWorker?.firstName || ''}
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
            value={updatedWorker?.name || ''}
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
            value={updatedWorker?.position || ''}
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
            value={updatedWorker?.age || ''}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="monthly_salary">Oylik maoshi</label>
          <input
            type="number"
            id="monthly_salary"
            name="monthly_salary"
            value={updatedWorker?.monthly_salary || ''}
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
            value={updatedWorker?.hours_to_work || ''}
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
            value={updatedWorker?.qr_code_text || ''}
            onChange={handleChange}
            required
          />
        </div>
        {/* Displaying the QR Code */}
        <div className={styles.qrCodeWrapper} style={{ marginTop: '20px' }}>
          {updatedWorker?.qr_code_text && (
            <ReactQRCode
              value={updatedWorker.qr_code_text}
              size={128}
              ref={qrCodeRef} // Attach ref to the QR code component
            />
          )}
        </div>

        {/* Button to Download QR Code */}
        <div className={styles.formGroup}>
          <button
            type="button"
            onClick={handleDownloadQRCode}
            disabled={!updatedWorker?.qr_code_text}
            className={styles.submitButton}
          >
            Yuklab olish QR Code
          </button>
        </div>

        {/* Submit button */}
        <div className={styles.formGroup}>
          <button
            type="submit"
            disabled={updating}
            className={styles.submitButton}
            style={{ marginTop: '20px' }}
          >
            {updating ? 'Updating Worker...' : 'Update Worker'}
          </button>
        </div>
      </form>

      {updateError && <p className={styles.error}>{updateError}</p>}
    </div>
  )
}

export default UpdateWorkerPage;

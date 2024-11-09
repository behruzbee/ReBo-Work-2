import styles from './styles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useFetchWorkers, useDeleteWorker } from '../../hooks/workers-hooks';

const WorkersPage = () => {
  const navigate = useNavigate();
  const { workers, loading: loadingWorkers, error: fetchError } = useFetchWorkers();
  const { deleteWorker, loading: deletingWorker, error: deleteError } = useDeleteWorker();

  // Handle worker deletion with confirmation
  const handleDelete = (workerId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this worker?");
    if (confirmDelete) {
      deleteWorker(workerId); // Proceed with deletion if confirmed
    }
  };

  return (
    <div className={styles.workersWrapper}>
      {/* Add a Link to navigate to /workers/create */}
      <Link to="/workers/create">
        <button>
          Yengi ishchi qo'shish
        </button>
      </Link>

      {fetchError && <p className={styles.error}>{fetchError}</p>} {/* Handle fetch error */}
      {loadingWorkers ? (
        <p>Ishchilar yo'klanmoqda...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>To'liq I.F</th>
              <th>Lavozim</th>
              <th>Ish xolati</th>
              <th>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id}>
                <td onClick={() => navigate(`/workers/worker/${worker.id}`)} className={styles.fullName}>{worker.firstName} {worker.name}</td>
                <td>{worker.position}</td>
                <td 
                  className={`${styles.workStatus} ${worker.is_working ? styles.working : styles.notWorking}`}
                >
                  {worker.is_working ? "Ishda" : "Ishda emas"}
                </td>
                <td className={styles.actionButtons}>
                  <button
                    className={styles.update}
                    onClick={() => navigate(`/workers/update/${worker.id}`)}
                  >
                    Tahrirlash
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => handleDelete(worker.id)} // Use the confirmation function
                    disabled={deletingWorker}
                  >
                    {deletingWorker ? 'O\'chirilmoqda...' : 'O\'chirish'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Handle error messages */}
      {deleteError && <p className={styles.error}>{deleteError}</p>}
    </div>
  );
}

export default WorkersPage;

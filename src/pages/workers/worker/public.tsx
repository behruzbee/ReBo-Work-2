import styles from './styles.module.scss';
import { useFetchWorkers } from '../../../hooks/workers-hooks';

const WorkersPublicPage = () => {
  const { workers, loading: loadingWorkers, error: fetchError } = useFetchWorkers();

  return (
    <div className={styles.workersWrapper}>
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
                <td className={styles.fullName}>{worker.firstName} {worker.name}</td>
                <td>{worker.position}</td>
                <td 
                  className={`${styles.workStatus} ${worker.is_working ? styles.working : styles.notWorking}`}
                >
                  {worker.is_working ? "Ishda" : "Ishda emas"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkersPublicPage;

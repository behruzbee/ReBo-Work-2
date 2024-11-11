import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './styles.module.scss';
import { useFetchTasks, useDeleteTask } from '../../hooks/task-hooks';

const TaskPage = () => {
  const navigate = useNavigate();
  const { tasks, loading, error } = useFetchTasks();
  const { deleteTask, loading: deletingTask } = useDeleteTask();

  // Sort tasks from new to old based on created_at date
  const sortedTasks = tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
    toast.success('Task deleted successfully');
  };

  // Function to determine task status styles
  const getTaskStatusStyle = (task) => {
    const taskDate = new Date(task.created_at);
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - taskDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (task.status === 'completed') {
      return styles.completed; // Light green glow for completed tasks
    } else if (task.status === 'pending' && timeDiff > oneDay) {
      return styles.overdue; // Red glow for overdue tasks
    } else {
      return styles.inProgress; // Light blue/yellow for in-progress tasks
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>VAZIFALARNI BOSHQARISH</h1>

      {/* Button to open Create Task Page */}
      <button className={styles.addTaskButton} onClick={() => navigate('/tasks/create')}>
        VAZIFA QO'SHISH
      </button>

      {/* Error or Loading Messages */}
      {error && <p className={styles.error}>{error}</p>}
      {loading && <p className={styles.loading}>Vazifalar yo'klanmoqda...</p>}

      {/* Task Table */}
      <h2 className={styles.taskListTitle}>Hamma Vazifalar</h2>
      {tasks.length === 0 ? (
        <p className={styles.noTasks}>Vazifalar yo'q</p>
      ) : (
        <table className={styles.taskTable}>
          <thead>
            <tr>
              <th>Vazifa</th>
              <th>Qayerga tayinlandi</th>
              <th>Status</th>
              <th>Tayinlangan vaqt</th>
              <th>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.id} className={`${styles.taskRow} ${getTaskStatusStyle(task)}`}>
                <td>{task.description}</td>
                <td>{task.store_name}</td>
                <td>{task.status === 'completed' ? 'Completed' : 'Pending'}</td>
                <td>{new Date(task.created_at).toLocaleString()}</td>
                <td>
                  {/* Edit Task Button */}
                  <button
                    className={`${styles.edit} ${styles.fadeIn}`}
                    onClick={() => navigate(`/tasks/edit/${task.id}`)} // Navigate to Edit Task Page
                  >
                    Edit
                  </button>

                  {/* Delete Task Button */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deletingTask}
                    className={`${styles.deleteButton} ${deletingTask ? styles.loading : ''}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskPage;

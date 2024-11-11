import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchTaskById, useUpdateTask } from '../../../hooks/task-hooks'; // Assuming you have these hooks
import { toast } from 'react-toastify';
import styles from './styles.module.scss';

const TaskEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get task ID from URL parameters
    const { task, loading, error } = useFetchTaskById(id || '0'); // Fetch the task by ID
    const { updateTask, loading: updatingTask } = useUpdateTask(); // Update task hook

    const [updatedTask, setUpdatedTask] = useState({
        description: '',
        store_name: '',
    });

    // When the task data is fetched, pre-fill the form
    useEffect(() => {
        if (task) {
            setUpdatedTask({
                description: task.description,
                store_name: task.store_name,
            });
        }
    }, [task]);

    const handleUpdateTask = async () => {
        if (!updatedTask.description || !updatedTask.store_name) {
            toast.error('Please provide both task description and store name');
            return;
        }

        try {
            await updateTask(id || '0', updatedTask);
            toast.success('Task updated successfully');
            navigate('/tasks'); // Navigate back to tasks list after successful update
        } catch (error) {
            toast.error('Failed to update task');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Edit Task</h1>

            {loading && <p>Loading task...</p>}
            {error && <p>{error}</p>}

            {/* Task Edit Form */}
            {task && (
                <div className={styles.formContainer}>
                    <input
                        type="text"
                        value={updatedTask.description}
                        onChange={(e) =>
                            setUpdatedTask({ ...updatedTask, description: e.target.value })
                        }
                        placeholder="Task Description"
                    />

                    {/* Select dropdown for Store Name */}
                    <select
                        value={updatedTask.store_name}
                        onChange={(e) =>
                            setUpdatedTask({ ...updatedTask, store_name: e.target.value })
                        }
                    >
                        {['VASMOY', 'OKTYABR', 'PREMIUM', '2-MIKRORAYON'].map((store) => (
                            <option key={store} value={store}>
                                {store}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleUpdateTask}
                        disabled={updatingTask}
                        className={styles.updateButton}
                    >
                        {updatingTask ? 'Updating...' : 'Update Task'}
                    </button>
                    <button
                        onClick={() => navigate('/tasks')}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskEditPage;

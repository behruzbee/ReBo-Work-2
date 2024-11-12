import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss'; // Assuming you have SCSS styles
import { useAddTask } from '../../../hooks/task-hooks'; // Import the useAddTask hook

const TaskCreatePage = () => {
    const navigate = useNavigate();
    const [newTask, setNewTask] = useState({
        description: '',
        store_name: 'VASMOY', // Default store name
    });
    const { addTask, loading, error } = useAddTask(); // Destructure the hook to get addTask, loading, and error states

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask({
            ...newTask,
            [name]: value,
        });
    };

    // Handle form submission
    const handleCreateTask = async () => {
        if (!newTask.description || !newTask.store_name) {
            toast.error('Please provide both task description and store name');
            return;
        }

        try {
            const createdTask = await addTask(newTask); // Call addTask to create a new task
            if (createdTask) {
                toast.success('Task created successfully!');
                setNewTask({ description: '', store_name: 'VASMOY' }); // Reset the form after creation
                navigate('/tasks'); // Navigate back to tasks list
            }
        } catch (error) {
            // Error is already handled by the hook
        }
    };

    return (
        <div className={styles.container}>
            <h1>YANGI VAZIFA QO'SHISH</h1>
            <div className={styles.formContainer}>
                {/* Task Description Input */}
                <div className={styles.inputGroup}>
                    <label htmlFor="description">Vazifa</label>
                    <input
                        id="description"
                        type="text"
                        name="description"
                        value={newTask.description}
                        onChange={handleChange}
                        placeholder="Enter task description"
                    />
                </div>

                {/* Store Name Select Dropdown */}
                <div className={styles.inputGroup}>
                    <label htmlFor="store_name">Qayerga tayinlansin</label>
                    <select
                        id="store_name"
                        name="store_name"
                        value={newTask.store_name}
                        onChange={handleChange}
                    >
                        <option value="VASMOY">VASMOY</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="OKTYABR">OKTYABR</option>
                        <option value="2-MIKRORAYON">2-MIKRORAYON</option>
                    </select>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleCreateTask}
                    disabled={loading} // Disable the button when loading
                    className={styles.submitButton}
                >
                    {loading ? 'Qo\'shilmoqda...' : 'Qo\'shish'} {/* Show loading state */}
                </button>

                {/* Error Message */}
                {error && <p className={styles.error}>{error}</p>} {/* Show error message if any */}
            </div>
        </div>
    );
};

export default TaskCreatePage;

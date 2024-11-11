import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from './styles.module.scss'; // Assuming you have SCSS styles
import { useNavigate } from 'react-router-dom';

const TaskCreatePage = () => {
    const navigate = useNavigate()
    const [newTask, setNewTask] = useState({
        description: '',
        store_name: 'VASMOY', // Default store name
    });
    const [isLoading, setIsLoading] = useState(false); // For loading state

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

        setIsLoading(true);
        try {
            // Replace this with actual API call to create the task
            console.log('Creating task:', newTask);
            
            // Simulate success response
            toast.success('Task created successfully!');
            setNewTask({ description: '', store_name: 'VASMOY' }); // Reset the form
            navigate('/tasks')
        } catch (error) {
            toast.error('Failed to create task.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Create New Task</h1>
            <div className={styles.formContainer}>
                <div className={styles.inputGroup}>
                    <label htmlFor="description">Task Description</label>
                    <input
                        id="description"
                        type="text"
                        name="description"
                        value={newTask.description}
                        onChange={handleChange}
                        placeholder="Enter task description"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="store_name">Store Name</label>
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

                <button
                    onClick={handleCreateTask}
                    disabled={isLoading}
                    className={styles.submitButton}
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </button>
            </div>
        </div>
    );
};

export default TaskCreatePage;

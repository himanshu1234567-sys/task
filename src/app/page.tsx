"use client"
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskModal from '@/app/components/TaskModal';
import TaskCard from './components/TaskCard';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { IoIosAddCircleOutline } from 'react-icons/io';
import LoginForm from './components/LoginForm';
import Layout from '@/app/layout'; // Ensure the path is correct

interface Task {
  id: string;
  name: string;
  descriptions: string[];
}

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');


  console.log("task description",taskDescription);
  
  const [descriptions, setDescriptions] = useState<string[]>([]);
  console.log("descritpions ", descriptions);
  
  const [error, setError] = useState('');
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  useEffect(() => {
    const getArrayFromLocalStorage = localStorage.getItem('localstorageTasks');
    if (getArrayFromLocalStorage) {
      const taskArray = JSON.parse(getArrayFromLocalStorage);
      setTasks(taskArray);
      console.log("Tasks loaded from localStorage:", taskArray);
    }
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'password') {
      setIsAuthenticated(true);
      setUsername(username);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleAddDescription = () => {
    if (taskDescription) {
      setDescriptions([...descriptions, taskDescription]);
      setTaskDescription('');
    }
  };

  const handleCreateTask = () => {
    if (!taskName.trim()) {
      setError('');
      return;
    }

    const newTaskId = uuidv4();
    const newTask: Task = {
      id: newTaskId,
      name: taskName,
      descriptions,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('localstorageTasks', JSON.stringify(updatedTasks));

    setTaskName('');
    setDescriptions([]);
    setError('');
    setShowCreateBoard(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setSelectedTask(updatedTask);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleRemoveDescription = (taskId: string, descriptionIndex: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newDescriptions = task.descriptions.filter((_, index) => index !== descriptionIndex);
        return {
          ...task,
          descriptions: newDescriptions,
        };
      }
      return task;
    }));
  };

  const handleAddDescriptionToTask = (taskId: string, description: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          descriptions: [...task.descriptions, description],
        };
      }
      return task;
    }));
  };

  const handleUpdateTaskName = (taskId: string, newName: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          name: newName,
        };
      }
      return task;
    }));
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (type === 'task') {
      const newTasks = Array.from(tasks);
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      setTasks(newTasks);
    } else if (type === 'description') {
      const sourceTaskIndex = tasks.findIndex(task => task.id === source.droppableId);
      const destinationTaskIndex = tasks.findIndex(task => task.id === destination.droppableId);
      const sourceTask = tasks[sourceTaskIndex];
      const destinationTask = tasks[destinationTaskIndex];
      const newSourceDescriptions = Array.from(sourceTask.descriptions);
      const [movedDescription] = newSourceDescriptions.splice(source.index, 1);

      if (sourceTaskIndex === destinationTaskIndex) {
        newSourceDescriptions.splice(destination.index, 0, movedDescription);
        const newTasks = [...tasks];
        newTasks[sourceTaskIndex].descriptions = newSourceDescriptions;
        setTasks(newTasks);
      } else {
        const newDestinationDescriptions = Array.from(destinationTask.descriptions);
        newDestinationDescriptions.splice(destination.index, 0, movedDescription);
        const newTasks = [...tasks];
        newTasks[sourceTaskIndex].descriptions = newSourceDescriptions;
        newTasks[destinationTaskIndex].descriptions = newDestinationDescriptions;
        setTasks(newTasks);
      }
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <Layout username={username} onLogout={() => setIsAuthenticated(false)}>
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="container mx-auto py-10 flex flex-col items-start ml-3 mr-5">
          <div className='flex  justify-start ml-5'>
            <Droppable droppableId="all-tasks" direction="horizontal" type="task">
              {(provided) => (
                <div
                  className="flex"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks.map((task, index) => (
                    <div className='m-2' key={task.id}>
                      <TaskCard
                        task={task}
                        index={index}
                        onTaskClick={handleTaskClick}
                        onRemoveTask={handleRemoveTask}
                        onRemoveDescription={handleRemoveDescription}
                        onAddDescription={handleAddDescriptionToTask}
                        onUpdateTaskName={handleUpdateTaskName}
                      />
                    </div>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            {showCreateBoard ? (
              <div className="mb-6 p-4 rounded shadow-md ">
                <div className=" mb-2">
                  <input
                    type="text"
                    placeholder="Enter list title..."
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="border p-2 rounded-xl"
                  />
                  {error && <p className="ml-2 text-right text-red-800 text-sm">{error}</p>}
                </div>
                <div className="flex mb-2 relative">
                  <input
                    placeholder="Add task"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="border rounded-xl p-2 flex-grow"
                  />
                  <button
                    onClick={handleAddDescription}
                    className="text-black absolute right-0 top-0 bottom-0 mr-2"
                  >
                    <IoIosAddCircleOutline size={20} />
                  </button>
                </div>

                <ul className="list-disc pl-5 mb-2">
                  {descriptions.map((description, index) => (
                    <li key={index}>{description}</li>
                  ))}
                </ul>
                <button
                  onClick={handleCreateTask}
                  className="bg-slate-950 text-white px-4 py-2 rounded w-full"
                >
                  Create
                </button>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setShowCreateBoard(true)}
                  className="bg-slate-950 bg-opacity-25 text-white px-4 py-2 mt-2 text-start ml-auto rounded hover:bg-slate-200 w-60 hover:text-black"
                >
                  + Create List
                </button>
              </div>
            )}
          </div>

          {selectedTask && (
            <TaskModal
              task={selectedTask}
              onClose={handleCloseModal}
              onSave={handleEditTask}
            />
          )}
        </main>
      </DragDropContext>
    </Layout>
  );
};

export default Home;

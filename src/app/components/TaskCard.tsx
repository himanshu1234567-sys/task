import React, { useState, useRef, useEffect } from 'react';
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { CiEdit } from 'react-icons/ci';

interface Task {
  id: string;
  name: string;
  descriptions: string[];
}

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskClick: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
  onRemoveDescription: (taskId: string, descriptionIndex: number) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onUpdateTaskName: (taskId: string, newName: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onTaskClick,
  onRemoveTask,
  onRemoveDescription,
  onAddDescription,
  onUpdateTaskName,
}) => {
  const [newDescription, setNewDescription] = useState('');
  console.log('newDescription',newDescription);
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState(task.name);
  const taskNameRef = useRef<HTMLDivElement | null>(null);

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onRemoveTask(task.id);
  };

  const handleDescriptionRemoveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    e.stopPropagation();
    onRemoveDescription(task.id, index);
  };

  const handleAddDescriptionClick = () => {
    if (newDescription.trim()) {
      onAddDescription(task.id, newDescription);
      setNewDescription(''); // Clear input after adding
      console.log("");
      
    }
  };

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (taskNameRef.current && !taskNameRef.current.contains(e.target as Node)) {
      handleSaveTaskName();
    }
  };

  const handleSaveTaskName = () => {
    onUpdateTaskName(task.id, editableName);
    setIsEditingName(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableName(e.target.value);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent default newline behavior
      handleSaveTaskName();
    }
  };

  useEffect(() => {
    if (isEditingName) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isEditingName]);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="border rounded-2xl shadow-md p-2 mb-4 bg-gray-200 w-60 "
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
  className="flex justify-between items-center mb-2"
  {...provided.dragHandleProps}
>
  {isEditingName ? (
    <input
      ref={taskNameRef}
      className="border p-2 mb-2 rounded-lg w-fit "
      value={editableName}
      onChange={handleNameChange}
      onKeyDown={handleNameKeyDown}
    />
  ) : (
    <h3
      onClick={handleNameClick}
      style={{ color: '#063970' }}
      className="text-2xl font-medium cursor-pointer w-auto break-words max-w-full"
    >
      {task.name}
    </h3>
  )}
  <HiOutlineDotsHorizontal />
</div>

          <Droppable droppableId={task.id} type="description">
            {(provided) => (
              <ul className="list-disc" ref={provided.innerRef} {...provided.droppableProps}>
                {task.descriptions.map((description, index) => (
                  <Draggable key={index} draggableId={`${task.id}-${index}`} index={index}>
                    {(provided) => (
                      <div>
                        <li
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => onTaskClick(task)}
                          className="rounded-lg border shadow-md p-2 mt-2 w-full flex justify-between bg-white"
                        >
                          {description}
                          <CiEdit
                            className="self-center"
                            style={{ visibility: hoveredIndex === index ? 'visible' : 'hidden' }}
                            onClick={(e) => handleDescriptionRemoveClick(e, index)}
                            size={18}
                            color="black"
                          />
                        </li>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
          <div className="mt-2">
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border rounded-xl p-2 flex-grow w-full"
              placeholder="Add List..."
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleAddDescriptionClick}
                className="text-black px-1 py-2 font-semibold"
              >
                + Add a list
              </button>
              {/* <button onClick={handleRemoveClick}>
                <AiOutlineClose size={18} color="black" />
              </button> */}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;

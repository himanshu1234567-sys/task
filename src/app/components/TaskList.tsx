import React from 'react';
import TaskCard from '@/app/components/TaskCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Task {
  id: string;
  name: string;
  descriptions: string[];
}

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onRemoveTask: (taskId: string) => void;
  onRemoveDescription: (taskId: string, descriptionIndex: number) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDragEnd: (result: any) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskClick,
  onRemoveTask,
  onRemoveDescription,
  onAddDescription,
  onDragEnd,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onTaskClick={onTaskClick}
                      onRemoveTask={onRemoveTask}
                      onRemoveDescription={onRemoveDescription}
                      onAddDescription={onAddDescription} // Pass the handler to TaskCard
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;

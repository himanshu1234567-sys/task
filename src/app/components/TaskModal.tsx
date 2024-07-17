import React, { useEffect, useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { v4 as uuidv4 } from 'uuid';
import { FaSave, FaEdit, FaTimes, FaPlus, FaTasks, FaClipboard, FaListUl, FaCheckSquare, FaCheck, FaTimesCircle } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import Switch from 'react-switch';
import { IoSend } from 'react-icons/io5';
import { MdOutlineAssignmentInd } from 'react-icons/md';
import { GrRevert } from 'react-icons/gr';

interface Task {
  id: string;
  name: string;
  taskStartdate?: Date | null;
  taskenddate?: Date | null;
  description: string;
  shortDescription?: string;
  comment?: string;
  priority?: string;
  reminder?: string;
  fromUser?: string;
  assignToUser?: string[];
  attachment?: any[];
}

interface Comment {
  id: string;
  username: string;
  text: string;
  date: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSave }) => {
  const [startDate, setStartDate] = useState<Date | null>(task.taskStartdate ?? null);
  const [endDate, setEndDate] = useState<Date | null>(task.taskenddate ?? null);
  const [priority, setPriority] = useState(task.priority ?? 'Normal');
  const [reminder, setReminder] = useState(task.reminder ?? 'None');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>(task.assignToUser ?? []);
  const [attachments, setAttachments] = useState<File[]>(task.attachment ?? []);
  const [editableDescription, setEditableDescription] = useState(task.description);
  const [editableName, setEditableName] = useState(task.name);
  const [assignedBy, setAssignedBy] = useState(task.fromUser ?? 'Manager');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [hideCheckedItems, setHideCheckedItems] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const descriptionRef = useRef(null);
  const [buttonTitle, setButtonTitle] = useState('Archive');
  const [showSendToBoardButton, setShowSendToBoardButton] = useState(false);
  const [isArchived, setIsArchived] = useState(false);


  const userList = [
    { id: '1', name: 'User A' },
    { id: '2', name: 'User B' },
    { id: '3', name: 'User C' },
    { id: '4', name: 'User D' },
  ];

  const handleUserSelection = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  useEffect(() => {
    setEditableDescription(task.description);
    setEditableName(task.name);
    setStartDate(task.taskStartdate ?? null);
    setEndDate(task.taskenddate ?? null);
    setPriority(task.priority ?? 'Normal');
    setReminder(task.reminder ?? 'None');
    setSelectedUsers(task.assignToUser ?? []);
    setAttachments(task.attachment ?? []);
    setComments([]);
    setNewComment('');
    setChecklistItems([]);
    setNewChecklistItem('');
    setIsEditingName(false);
    if (isEditing) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [task, isEditing]);
  const handleOutsideClick = (e) => {
    if (descriptionRef.current && !descriptionRef.current.contains(e.target)) {
      handleSaveDescription();
    }
  };


  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setAttachments(filesArray);
    }
  };

  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
  };

  const handleSaveDescription = () => {
    onSave({ ...task, description: editableDescription });
    setIsEditing(false); // Exit edit mode after saving
  };


  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    onSave({ ...task, name: editableName });
  };
  const handleArchiveClick = () => {
    setShowSendToBoardButton(true); // Show Send to Board button
    // Additional logic for archiving
  };

  const handleSendToBoardClick = () => {
    setShowSendToBoardButton(false); // Hide Send to Board button
    // Additional logic for sending to board
  };

  const handleToggleArchive = () => {
    setIsArchived(!isArchived); // Toggle the archive state
  };

  const handleAddComment = () => {
    const trimmedComment = newComment.trim();

    if (trimmedComment !== '') {
      const newCommentObj = {
        id: uuidv4(),
        username: 'User', // Replace with actual username logic if applicable
        date: new Date().toLocaleDateString(), // Example date format, adjust as needed
        text: trimmedComment,
      };

      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const handleAddChecklistItem = () => {
    const trimmedItem = newChecklistItem.trim();

    if (trimmedItem !== '') {
      const newItem: ChecklistItem = {
        id: uuidv4(),
        text: trimmedItem,
        completed: false,
      };

      setChecklistItems([...checklistItems, newItem]);
      setNewChecklistItem('');
    }
  };

  const handleToggleChecklistItem = (itemId: string) => {
    setChecklistItems(
      checklistItems.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const renderUserList = () => {
    const assignTask = () => {
      setShowUserModal(false);
    };



    return (
      <div className="bg-white p-4 rounded shadow-md w-full sm:w-1/2">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">{task.name}</h2>
        {userList.map((user) => (
          <div key={user.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={user.id}
              checked={selectedUsers.includes(user.id)}
              onChange={() => handleUserSelection(user.id)}
              className="mr-2"
            />
            <label htmlFor={user.id}>{user.name}</label>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <button onClick={() => setShowUserModal(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2">
            Close
          </button>
          <button onClick={assignTask} className="bg-slate-950 text-white px-4 py-2 rounded">
            Assign
          </button>
        </div>
      </div>
    );
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent de.keefault newline behavior
      handleSaveDescription();
    }
  };

  const handleDescriptionClick = () => {
    setIsEditing(true);
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 max-h-[80%] min-w-[60%] overflow-y-scroll  relative" style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
        <div className='inline-flex pt-2' >
          <FaTimes className="absolute top-5 mr-1 right-2 text-gray-700 cursor-pointer " onClick={onClose} />
        </div>
        <div className="inline-flex justify-start items-center">
              <label className="font-mono  ">Assigned by: </label>
              <p className=" font-bold ">{assignedBy}</p>
            </div>
        <h2 className="text-xl font-bold mb-4">
          {isEditingName ? (
            <input
              type="text"
              className="border w-full p-2 mb-2"
              value={editableName}
              onChange={(e) => setEditableName(e.target.value)}
            />
          ) : (
            <div className="flex items-center justify-between">
              <span>{editableName}</span>

            </div>
          )}
        </h2>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/1 pr-0 sm:pr-2 mb-4 sm:mb-0">
            <label className="block mb-2 flex items-center ">
              <FaClipboard className="mr-2 " /> <h3 className='font-bold'>Description</h3>
            </label>
            {isEditing ? (
              <input
                ref={descriptionRef}
                className="border w-full p-2 mb-2 rounded-lg"
                value={editableDescription}
                onChange={handleDescriptionChange}
                onKeyDown={handleKeyDown}
                placeholder='add description'
              ></input>
            ) : (
              <div ref={descriptionRef} onClick={handleDescriptionClick}>
                <p  className="p-5 rounded-lg border mb-2 w-full ">{editableDescription}</p>
              </div>
            )}
            <div className="flex flex-col mt-4 justify-between">
              <label className="block mb-2 flex items-center font-bold">
                <MdOutlineAssignmentInd className="mr-2" /> Assigned to
              </label>

              <div className="border p-2 mb-4 max-h-40 overflow-y-auto rounded-lg">
                {selectedUsers.map(userId => (
                  <div key={userId} className="flex items-center mb-2">
                    <span className="font-semibold">{userList.find(user => user.id === userId)?.name}</span>
                  </div>
                ))}
                <button
                  onClick={() => setShowUserModal(true)}
                  className="bg-slate-950 text-white px-4 py-2 rounded"
                >
                  Assign To
                </button>
              </div>
            </div>

            <div className='mt-2'>
              <div className='flex justify-between mb-2'>
                <label className="block mb-2 flex items-center font-bold">
                  <IoMdCheckmarkCircleOutline className="mr-2" /> Checklist
                </label>
                <Switch
                  onChange={() => setHideCheckedItems(!hideCheckedItems)}
                  checked={hideCheckedItems}
                  offColor="#888"
                  onColor="#004c00"
                  height={20} // Adjust height
                  width={50} // Adjust width
                  uncheckedIcon={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: 10,
                        color: 'white',
                        paddingRight: 2,
                      }}
                    >
                      Show
                    </div>
                  }
                  checkedIcon={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        fontSize: 10,
                        color: 'white',
                        paddingLeft: 2,
                      }}
                    >
                      Hide
                    </div>
                  }
                />
              </div>
              <div className="border p-2 mb-4 relative max-h-40 overflow-y-auto rounded-lg" style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
                {checklistItems.map(item => (

                  <div key={item.id} className={`items-center mb-2 flex   ${item.completed && hideCheckedItems ? 'hidden' : ''}`}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleChecklistItem(item.id)}
                      className="mr-2"
                    />
                    <span className={item.completed ? 'line-through' : ''}>{item.text}</span>
                    {!item.completed && (
                      <button
                        onClick={() => {
                          const updatedItems = checklistItems.filter(i => i.id !== item.id);
                          setChecklistItems(updatedItems);
                        }}
                        className="ml-auto text-black px-2 rounded"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex items-center relative">
                  <input
                    type="text"
                    className="border p-2 w-full rounded-lg"
                    placeholder="Add Checklist Item..."
                    value={newChecklistItem}
                    onChange={(e) => setNewChecklistItem(e.target.value)}
                  />
                  <button
                    onClick={handleAddChecklistItem}
                    className=" text-black px-2 absolute right-0"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className='mt-2'>
                <label className="block font-bold mb-2">Comments</label>
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    className="border w-full p-1 rounded-sm "
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}

                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-slate-950 text-white px-4 p-2 py-2 ml-2 rounded"
                  >
                    <IoSend />
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto" style={{ overflowY: 'auto', scrollbarWidth: 'none' }}>
                  <ul>
                    {comments.map((comment) => (
                      <li key={comment.id} className="mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{comment.username}</span>
                          <span className="text-gray-600 text-sm">{comment.date}</span>
                        </div>
                        <p>{comment.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

          </div>
          
          <div className="w-full sm:w-1/2 pl-1 sm:pl-2">
         

            <div className="flex flex-col">
              <label className="block mb-2 font-bold">Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                className="border p-2 mb-4 w-full rounded-lg"
                placeholderText="Select start date"
              />
            </div>
            <div className="flex flex-col">
              <label className="block mb-2 font-bold">End Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                className="border p-2 mb-4 w-full rounded-lg"
                placeholderText="Select end date"
              />
            </div>
       

            <div className="flex flex-col">
              <label className="block mb-2 font-bold">Priority</label>
              <select
                className="border p-2 mb-4 w-full rounded-lg"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="block mb-2 font-bold">Reminder</label>
              <select
                className="border p-2 mb-4 w-full rounded-lg"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
              >
                <option value="None">None</option>
                <option value="1 Hour Before">1 Hour Before</option>
                <option value="1 Day Before">1 Day Before</option>
              </select>
            </div>

            {/* Assigned To section */}
            <div className="mb-4">
              <label className="block font-bold mb-2">Attachments</label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="border w-full p-2 mb-2 rounded-lg"
              />
              {attachments.length > 0 && (
                <ul className="list-disc list-inside">
                  {attachments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>
            <hr></hr>
            <div className="flex flex-col">
            <button
            className={`px-4 py-2 rounded mt-2 flex items-center justify-center ${
              isArchived ? 'bg-red-950' : 'bg-slate-950'
            } text-white`}
            onClick={handleToggleArchive}
          >
            {isArchived && <GrRevert className="mr-1" />}
            {isArchived ? 'Send to Board' : 'Archive'}
          </button>
             
            </div>
          </div>
        </div>

        {showUserModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            {renderUserList()}
          </div>
        )}
      </div>
    </div>

  );
};

export default TaskModal;

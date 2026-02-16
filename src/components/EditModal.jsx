import { useState } from "react";

const EditModal = ({
  isOpen,
  onClose,
  itemName,
  onRename,
  onDelete,
  entityType = "item" // "item" or "checklist"
}) => {
  const [newName, setNewName] = useState(itemName);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl relative w-full max-w-md mx-4">
        <div>
          <input
            type="text"
            value={newName}
            className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={e => setNewName(e.target.value)}
            placeholder={`Enter ${entityType} name`}
          />
          <button
            className="w-full py-3 mb-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => onRename(newName)}
          >
            Rename
          </button>
        </div>
        <button
          className="w-full py-3 mb-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-400"
          onClick={onDelete}
        >
          Delete {entityType}
        </button>
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default EditModal;

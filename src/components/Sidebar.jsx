import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useList } from "../contexts/ListContext";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { getList, createList, listData, currentListId, setCurrentListId, listChange, setListChange, saveChecklistChanges } = useList();
  const { auth_token } = useAuth();
  const [listName, setListName] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleCreateList = async () => {
    await createList(listName);
    setCreateModalOpen(false);
    setListName('');
  };

  const handleListClick = async (newListId) => {
    // Prevent multiple clicks while switching
    if (isSwitching) return;

    // If clicking the same list, do nothing
    if (newListId === currentListId) return;

    setIsSwitching(true);

    // If there are unsaved changes on the current list, save them first
    if (listChange && currentListId) {
      console.log('Auto-saving changes before switching lists...');

      // Find and pass the actual checklist data
      const checklistToSave = listData.find(list => list.id === currentListId);

      if (checklistToSave) {
        await saveChecklistChanges(checklistToSave);
      } else {
        console.error('Could not find checklist to save');
      }
    }

    // Switch to the new list
    setCurrentListId(newListId);
    setListChange(false);
    setIsSwitching(false);
  };

  useEffect(() => {
    if (auth_token) {
      getList();
    }
  }, [auth_token, getList]);

  return (
    <div className="flex flex-col h-full p-4">
      <button
        className="mb-8 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-bold text-xl"
        onClick={() => setCreateModalOpen(true)}
      >
        Add a List
      </button>

      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Create New List</h2>
            <input
              type="text"
              value={listName}
              onChange={e => setListName(e.target.value)}
              placeholder="Enter list name"
              className="w-full px-3 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCreateList}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Create
              </button>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="flex flex-col gap-2">
        {listData && listData.length > 0 ? (
          listData.map((list, idx) => (
            <button
              key={list.id}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium ${list.id === currentListId
                  ? 'bg-blue-200 dark:bg-blue-800'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900'
                }`}
              onClick={() => handleListClick(list.id)}
              disabled={isSwitching}
            >
              {list.checklist_name}
              {list.id === currentListId && listChange && (
                <span className="ml-auto text-xs text-orange-600 dark:text-orange-400">●</span>
              )}
            </button>
          ))
        ) : (
          <span className="text-gray-500">No checklists found.</span>
        )}
      </nav>
    </div>
  );
}

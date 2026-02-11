import { useList } from '../contexts/ListContext';
import { useAuth } from '../contexts/AuthContext';
import CheckList from '../components/CheckList';
import { useState, useEffect, useRef } from 'react';

const UserHome = () => {
  const { listData, createItem, currentListId, getList, listChange, saveChecklistChanges } = useList();
  const { logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const listChangeRef = useRef(listChange);
  const currentListIdRef = useRef(currentListId);
  const listDataRef = useRef(listData);

  // Keep refs updated
  useEffect(() => {
    listChangeRef.current = listChange;
    currentListIdRef.current = currentListId;
    listDataRef.current = listData;
  }, [listChange, currentListId, listData]);

  // Auto-save on page unload (tab close, browser close, navigate away)
  useEffect(() => {
    const handleBeforeUnload = async (e) => {
      if (listChangeRef.current && currentListIdRef.current) {
        const checklistToSave = listDataRef.current.find(
          list => list.id === currentListIdRef.current
        );

        if (checklistToSave) {
          e.preventDefault();
          await saveChecklistChanges(checklistToSave);
          e.returnValue = '';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveChecklistChanges]);

  // Auto-save when component unmounts (navigate away in app)
  useEffect(() => {
    return () => {
      if (listChangeRef.current && currentListIdRef.current) {
        const checklistToSave = listDataRef.current.find(
          list => list.id === currentListIdRef.current
        );

        if (checklistToSave) {
          saveChecklistChanges(checklistToSave);
        }
      }
    };
  }, [saveChecklistChanges]);

  const handleAddItem = async () => {
    if (!itemName.trim()) return;

    await createItem(itemName, "Not Ready", currentListId);
    await getList();
    setShowModal(false);
    setItemName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-1">
      <div className="w-full max-w-2xl bg-gray-50 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">User Home</h1>
        <div className="flex justify-end mb-6">
          {listChange && (
            <span className="mr-4 px-3 py-2 text-sm text-orange-600 bg-orange-50 rounded-md">
              Unsaved changes
            </span>
          )}
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            Add Item
          </button>
        </div>
        <CheckList />
      </div>
      {/* <CheckList /> */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 relative">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add Item</h2>
            <input
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              placeholder="Item name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserHome

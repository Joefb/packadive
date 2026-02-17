import { useList } from '../contexts/ListContext';
import CheckList from '../components/CheckList';
import { useState, useEffect, useRef } from 'react';

const UserHome = () => {
  const { listData, createItem, currentListId, getList, listChange, saveChecklistChanges } = useList();
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

  // Get current checklist
  const currentChecklist = listData.find(list => list.id === currentListId);
  const checklistName = currentChecklist?.checklist_name || 'No List Selected';
  const totalItems = currentChecklist?.list_items?.length || 0;
  const packedItems = currentChecklist?.list_items?.filter(item => item.status === "Packed").length || 0;
  const progress = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left - Checklist Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {checklistName}
                  </h1>
                </div>
              </div>

              {/* Stats Row */}
              {currentChecklist && (
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{packedItems}</span> packed
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> total
                    </span>
                  </div>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold text-gray-900 dark:text-white">{progress}%</span> complete
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right - Add Item Button */}
            {currentChecklist && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center sm:justify-start whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            )}
          </div>
        </div>

        {/* Checklist Component */}
        {currentChecklist ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            <CheckList setShowModal={setShowModal} />
          </div>
        ) : (
          /* No Checklist Selected State */
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Checklist Selected</h2>
            <p className="text-gray-500 dark:text-gray-500">Select a checklist from the sidebar or create a new one to get started!</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 relative border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Item</h2>
            </div>

            <input
              type="text"
              value={itemName}
              onChange={e => setItemName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddItem()}
              placeholder="Enter item name..."
              autoFocus
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserHome

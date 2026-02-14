import { useList } from "../contexts/ListContext";
import { useState, useEffect } from "react";
import { Progress } from "@material-tailwind/react";
import { useAutoAnimate } from '@formkit/auto-animate/react'


const ITEM_STATES = ["Not Ready", "Checked", "Packed"];
const ITEM_COLORS = {
  "Not Ready": "bg-gray-200 text-gray-900",
  "Checked": "bg-blue-500 text-white",
  "Packed": "bg-green-500 text-white",
};

const CheckList = ({ setShowModal }) => {
  // const [items, setItems] = useState([0, 1, 2])
  const [parent, enableAnimations] = useAutoAnimate()
  // const add = () => setItems([...items, items.length])

  const { deleteItem, updateItemStatus, getList, listData, setListData, currentListId, setCurrentListId, listChange, setListChange } = useList();
  const checklist = listData.find(list => list.id === currentListId) //|| listData[0]
  const [originalChecklist, setOriginalChecklist] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToModifyId, setItemToModifyId] = useState(null);
  let holdTimeout = null;
  const [sortedList, setSortedList] = useState([]);
  const [updateItemName, setUpdateItemName] = useState(false);

  const statusOrder = {
    "Not Ready": 0,
    "Checked": 1,
    "Packed": 2
  }

  useEffect(() => {
    setSortedList([...(checklist?.list_items || [])].sort((a, b) => statusOrder[a.status] - statusOrder[b.status]));

  }, [checklist]);

  const handleItemClick = (itemId) => {
    setListData(prevData => {
      return prevData.map(list => {
        if (list.id === currentListId && Array.isArray(list?.list_items)) {
          return {
            ...list,
            list_items: list.list_items.map((item) => {
              if (item.id === itemId) {
                const currentIdx = ITEM_STATES.indexOf(item.status);
                const newStatus = ITEM_STATES[(currentIdx + 1) % ITEM_STATES.length];
                return { ...item, status: newStatus };
              }
              return item;
            })
          }
        }
        return list;
      })
    });

    setListChange(true);
  };

  // Initialize originalChecklist when checklist changes (e.g., when switching lists)
  useEffect(() => {
    if (checklist) {
      // Deep copy the checklist to store the original state
      setOriginalChecklist(JSON.parse(JSON.stringify(checklist)));
    }
  }, [currentListId]); // Only run when currentListId changes, not when checklist changes


  useEffect(() => {
    if (!checklist || !originalChecklist) {
      setListChange(false);
      return;
    }

    if (checklist?.list_items?.length !== originalChecklist?.list_items?.length) {
      setListChange(true);
      return;
    }

    const changed = checklist?.list_items?.some((item, index) => {
      const original = originalChecklist?.list_items[index];
      if (!original) return true; // New item added
      return item?.status !== original?.status
    })

    setListChange(!!changed);
  }, [checklist, originalChecklist, setListChange]);

  // Set inupt to name of item
  useEffect(() => {
    setUpdateItemName(checklist?.list_items?.find(item => item?.id === itemToModifyId)?.item_name || '')
  }, [showDeleteModal])

  const startHoldTimer = (idx) => {
    holdTimeout = setTimeout(() => {
      setItemToModifyId(idx);
      // Do api call here
      handleHold()
    }, 2000); // 2 seconds hold time
  }

  const clearHoldTimer = () => {
    clearTimeout(holdTimeout);
    holdTimeout = null;
  }

  const handleHold = () => {
    setShowDeleteModal(true);
  }

  const handleDelete = async () => {
    await deleteItem(itemToModifyId);
    setItemToModifyId(null);
    setShowDeleteModal(false);
  }

  const handleUpdateItemName = async (newName) => {
    const itemToUpdate = checklist.list_items.find(item => item.id === itemToModifyId);

    await updateItemStatus({ ...itemToUpdate, item_name: newName });
    await getList();
    setItemToModifyId(null);
    setShowDeleteModal(false);
  }


  if (!checklist) return <div className="text-gray-500">No checklists found. Add a checklist!</div>;

  return (
    <div>
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl relative w-full max-w-md mx-4">
            <div>
              <input
                type="text"
                value={updateItemName}
                className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={e => {
                  setUpdateItemName(e.target.value);
                }}
              />
              <button
                className="w-full py-3 mb-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => {
                  handleUpdateItemName(updateItemName);
                }}
              >Rename</button>
            </div>
            <button
              className="w-full py-3 mb-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow focus:outline-none focus:ring-2 focus:ring-red-400"
              onClick={() => {
                handleDelete();
              }}
            >
              Delete Item
            </button>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              onClick={() => setShowDeleteModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">{checklist.checklist_name}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          Add Item
        </button>
      </div>

      <Progress
        label="Packed"
        value={Math.round((checklist.list_items.filter(item => item.status === "Packed").length / checklist.list_items.length) * 100)}
        color="green"
        className="mb-4"
      />
      <ul className="flex flex-col gap-2 mt-4" ref={parent}>
        {sortedList?.map((item, idx) => (
          <li key={item?.id}>
            <button
              className={`w-full px-4 py-2 rounded transition ${ITEM_COLORS[item.status]}`}
              onClick={() => handleItemClick(item?.id)}
              onMouseDown={() => startHoldTimer(item?.id)}
              onMouseUp={clearHoldTimer}
              onMouseLeave={clearHoldTimer}
              onTouchStart={() => startHoldTimer(item?.id)}
              onTouchEnd={clearHoldTimer}
            >
              {item?.item_name} — {item?.status}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CheckList


// {showDeleteModal && (
//   <div className="bg-white p-8 rounded shadow-lg relative w-full m-10">
//     <button
//       className=""
//       onClick={() => {
//         handleDelete();
//       }}
//     >
//       Delete Item
//     </button>
//     <button
//       className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//       onClick={() => setShowDeleteModal(false)}
//     >
//       &times;
//     </button>
//   </div>
// )}
//

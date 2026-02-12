import { useList } from "../contexts/ListContext";
import { useState, useEffect } from "react";
import { Progress } from "@material-tailwind/react";


const ITEM_STATES = ["Not Ready", "Checked", "Packed"];
const ITEM_COLORS = {
  "Not Ready": "bg-gray-200 text-gray-900",
  "Checked": "bg-blue-500 text-white",
  "Packed": "bg-green-500 text-white",
};

const CheckList = () => {
  const { deleteItem, getList, listData, setListData, currentListId, setCurrentListId, listChange, setListChange } = useList();
  const checklist = listData.find(list => list.id === currentListId);
  const [originalChecklist, setOriginalChecklist] = useState(null);
  let holdTimeout = null;

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

  const startHoldTimer = (idx) => {
    holdTimeout = setTimeout(() => {
      // Do api call here
      handleHold(idx)
    }, 2000); // 2 seconds hold time
  }

  const clearHoldTimer = () => {
    clearTimeout(holdTimeout);
    holdTimeout = null;
  }

  const handleHold = (itemId) => {
    console.log("Item held for 2 seconds:", itemId);
    deleteItem(itemId);
  }


  if (!checklist) return <div className="text-gray-500">No checklist selected.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{checklist.checklist_name}</h2>
      <Progress
        label="Packed"
        value={Math.round((checklist.list_items.filter(item => item.status === "Packed").length / checklist.list_items.length) * 100)}
        color="green"
        className="mb-4"
      />
      <ul className="flex flex-col gap-2 mt-4">
        {checklist.list_items.map((item, idx) => (
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

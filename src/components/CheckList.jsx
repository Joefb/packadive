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
  const { getList, listData, setListData, currentListId, setCurrentListId, listChange, setListChange } = useList();
  const checklist = listData.find(list => list.id === currentListId);
  const [originalChecklist, setOriginalChecklist] = useState(null);


  // Local state for item statuses (initialize all to "Not Ready")
  const [itemStates, setItemStates] = useState(
    () =>
      checklist?.list_items?.map(() => "Not Ready") || []
  );

  const handleItemClick = (idx) => {
    setItemStates(states => {
      const nextStates = [...states];
      const currentIdx = ITEM_STATES.indexOf(states[idx]);
      nextStates[idx] = ITEM_STATES[(currentIdx + 1) % ITEM_STATES.length];
      setListData(prevData => {
        return prevData.map(list => {
          if (list.id === currentListId && Array.isArray(list?.list_items)) {
            return {
              ...list,
              list_items: list.list_items.map((item, itemIdx) => {
                return itemIdx === idx ? { ...item, status: nextStates[idx] } : item;
              })
            }
          };

          return list;
        })

      })
      return nextStates;
    });
  };

  // Initialize originalChecklist when checklist changes (e.g., when switching lists)
  useEffect(() => {
    if (checklist) {
      // Deep copy the checklist to store the original state
      setOriginalChecklist(JSON.parse(JSON.stringify(checklist)));
      setItemStates(checklist?.list_items?.map(item => item?.status || "Not Ready") || []);
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

  if (!checklist) return <div className="text-gray-500">No checklist selected.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{checklist.checklist_name}</h2>
      <Progress label="Packed" value={Math.round((itemStates.filter(state => state === "Packed").length / itemStates.length) * 100)} color="green" className="mb-4" />
      <ul className="flex flex-col gap-2 mt-4">
        {checklist.list_items.map((item, idx) => (
          <li key={item?.id}>
            <button
              className={`w-full px-4 py-2 rounded transition ${ITEM_COLORS[itemStates[idx]]}`}
              onClick={() => handleItemClick(idx)}
            >
              {item?.item_name} — {itemStates[idx]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CheckList


// <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8 mt-5">
//   <h2 className="text-3xl font-bold mb-6 text-gray-800">{checklist.checklist_name}</h2>
//   <div className="flex justify-center mb-6">
//     <ul className="flex flex-col gap-2 mt-4 w-full">
//       {checklist.list_items.map((item, idx) => (
//         <li key={item?.id}>
//           <button
//             className={`w-full px-4 py-2 rounded transition ${ITEM_COLORS[itemStates[idx]]}`}
//             onClick={() => handleItemClick(idx)}
//           >
//             {item?.item_name} — {itemStates[idx]}
//           </button>
//         </li>
//       ))}
//     </ul>
//   </div>
// </div>


import { useList } from "../contexts/ListContext";
import { useState } from "react";

const ITEM_STATES = ["Not Ready", "Checked", "Packed"];
const ITEM_COLORS = {
  "Not Ready": "bg-white text-gray-900",
  "Checked": "bg-blue-500 text-white",
  "Packed": "bg-green-500 text-white",
};

const CheckList = () => {
  const { getList, listData, currentListId, setCurrentListId } = useList();
  const checklist = listData.find(list => list.id === currentListId);

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
      return nextStates;
    });
  };

  if (!checklist) return <div className="text-gray-500">No checklist selected.</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{checklist.checklist_name}</h2>
      <ul className="flex flex-col gap-2 mt-4">
        {checklist.list_items.map((item, idx) => (
          <li key={item.id}>
            <button
              className={`w-full px-4 py-2 rounded transition ${ITEM_COLORS[itemStates[idx]]}`}
              onClick={() => handleItemClick(idx)}
            >
              {item.item_name} — {itemStates[idx]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CheckList

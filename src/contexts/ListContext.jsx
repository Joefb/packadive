import { useMemo, createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

// Endpoints:
const API_LISTS = "http://127.0.0.1:5000/checklists";
const API_ITEMS = "http://127.0.0.1:5000/list_item";

//Step 1
//Create the context
const ListContext = createContext();

//Step 2
//Create useList hook to consume this context
export const useList = () => {
  const context = useContext(ListContext);
  return context;
}

//Step 3
export const ListProvider = ({ children }) => {
  const [listData, setListData] = useState([]);
  const { auth_token } = useAuth() || {};
  const [currentListId, setCurrentListId] = useState(null);
  const [listChange, setListChange] = useState(false);


  // Get list data from local storage
  useEffect(() => {
    const listData = localStorage.getItem('list_data');

    if (listData) {
      setListData(JSON.parse(listData));
      if (JSON.parse(listData)?.length > 0 && !currentListId) {
        // setCurrentListId(JSON.parse(listData)[0].checklist_id);
        setCurrentListId(JSON.parse(listData)[0].id);
      }
    }
  }, []);

  // Get the total progress
  const totalProgress = useMemo(() => {
    let totalItems = 0;
    let packedItems = 0;

    listData.forEach(list => {
      totalItems += list.list_items.length;

      list.list_items.forEach(item => {
        if (item.status === "Packed") {
          packedItems++;
        }
      });
    });

    // Return the percentage (handle division by zero)
    return totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;
  }, [listData]);

  ///// CHECKLIST FUNCTIONS /////
  // Get list function
  const getList = useCallback(async () => { //sending api request
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    console.log('Getting lists');

    const response = await fetch(API_LISTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
    });

    console.log("Response");
    const listData = await response.json();
    console.log('List data:', listData);

    setListData(listData);
    localStorage.setItem("list_data", JSON.stringify(listData));
  }, [auth_token]);

  // Create List
  const createList = useCallback(async (checklistName) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    try {
      const response = await fetch(API_LISTS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth_token
        },
        body: JSON.stringify({
          checklist_name: checklistName,
        })
      })
      const responseData = await response.json();
      console.log(responseData);

      // Refresh list data after creating a new list
      await getList();
    } catch (error) {
      console.error('Error creating list:', error);
    }
  }, [auth_token, getList]);

  // Update Checklist Name
  const updateList = useCallback(async (checkListID, checklistName) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    const response = await fetch(API_LISTS, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
      body: JSON.stringify({
        checklist_id: checkListID,
        checklist_name: checklistName
      })
    })

    const updatedListData = await response.json();
    console.log(updatedListData);

    const updatedList = listData.map(list => {
      if (list.checklist_id === checkListID) {
        return updatedListData;
      } else {
        return list;
      }
    })

    localStorage.setItem('list_data', JSON.stringify(updatedList));
    setListData(updatedList);
    await getList();
  }, [auth_token, listData, getList]);

  // Delete List
  const deleteList = useCallback(async (checkListId) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    const response = await fetch(API_LISTS, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
      body: JSON.stringify({
        checklist_id: checkListId,
      })

    });
    const responseData = await response.json();
    console.log(responseData);

    const updatedList = listData.filter(list => list.checklist_id !== checkListId);
    setListData(updatedList);
    localStorage.setItem('list_data', JSON.stringify(updatedList));
    await getList();
  }, [auth_token, listData, getList]);

  ///// ITEMS FUNCTIONS /////

  const createItem = useCallback(async (itemName, status, listId) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    // item_name=data["item_name"],
    // status=data["status"],
    // checklist_id=data["checklist_id"],
    //
    try {
      const response = await fetch(API_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth_token
        },
        body: JSON.stringify({
          item_name: itemName,
          status: status,
          checklist_id: listId,
        })
      })
      const responseData = await response.json();
      console.log(responseData);

    } catch (error) {
      console.error('Error creating item:', error);
    }

  }, [auth_token, listData, getList]);

  // Delete Item
  const deleteItem = useCallback(async (itemId) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    try {
      // Include itemId in the URL path
      const response = await fetch(`${API_ITEMS}/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth_token
        },
        // body: JSON.stringify({
        //   status: newStatus,
        // })
      });

      const currentList = listData?.find(list => list?.id === currentListId);
      const updatedListItems = currentList?.list_items?.filter(item => item?.id !== itemId);
      const updatedList = { ...currentList, list_items: updatedListItems };
      setListData(previousList => {
        return previousList?.map(list => {
          if (list?.id === currentListId) {
            return updatedList;
          } else {
            return list;
          }
        })
      });

      localStorage.setItem('list_data', JSON.stringify(updatedListItems));
      await getList();

      const responseData = await response.json();
      console.log('Item deleted:', responseData);
      // return responseData;

    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }

  }, [auth_token, listData, getList]);

  // const updateItem = useCallback(async (itemId, itemName) => {
  //   // item_name=data["item_name"],
  //   // status=data["status"],
  //   // checklist_id=data["checklist_id"],
  //
  // }, []);
  //
  // const deleteItem = useCallback(async (itemId) => {
  //
  // }, []);
  // Update Item Status
  // Update Item Status
  const updateItemStatus = useCallback(async (itemId, newStatus) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return;
    }

    try {
      // Include itemId in the URL path
      const response = await fetch(`${API_ITEMS}/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + auth_token
        },
        body: JSON.stringify({
          status: newStatus,
        })
      });
      const responseData = await response.json();
      console.log('Item updated:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  }, [auth_token]);

  // Save all changed items in the current checklist
  const saveChecklistChanges = useCallback(async (checklist) => {
    if (!auth_token) {
      console.error('No auth token found.');
      return false;
    }

    if (!checklist || !checklist.list_items) {
      console.error('Invalid checklist data');
      return false;
    }

    try {
      console.log(`Saving ${checklist.list_items.length} items for checklist ${checklist.id}`);

      // Update all items in the checklist
      const updatePromises = checklist.list_items.map(item =>
        updateItemStatus(item.id, item.status)
      );

      await Promise.all(updatePromises);
      console.log('All items saved successfully');

      // Refresh the list data from server
      await getList();

      // Reset the change flag
      setListChange(false);

      return true;
    } catch (error) {
      console.error('Error saving checklist changes:', error);
      return false;
    }
  }, [auth_token, updateItemStatus, getList]);

  const value = {
    listData,
    currentListId,
    setCurrentListId,
    setListData,
    deleteList,
    createList,
    updateList,
    getList,
    createItem,
    deleteItem,
    updateItemStatus,
    saveChecklistChanges,
    listChange,
    setListChange,
    totalProgress,
  }

  return (
    <ListContext.Provider value={value}>
      {children}
    </ListContext.Provider>
  )
}


import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

// Endpoints:
const API_LISTS = "http://127.0.0.1:5000/checklists";

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

  // Get list data from local storage
  useEffect(() => {
    const listData = localStorage.getItem('list_data');

    if (listData) {
      setListData(JSON.parse(listData));
    }
  }, []);

  useEffect(() => {
    if (auth_token) {
      getList();
    }
  }, [auth_token]);

  // Get list function
  const getList = async () => { //sending api request

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
  }

  // Create List
  const createList = async (checklistName) => {
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
  }

  // Update Checklist Name
  const updateList = async (checkListID, checklistName) => {
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
  }

  // Delete List
  const deleteList = async (checkListId) => {
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
  }

  const value = {
    listData,
    deleteList,
    createList,
    updateList,
    getList,
  }

  return (
    <ListContext.Provider value={value}>
      {children}
    </ListContext.Provider>
  )
}


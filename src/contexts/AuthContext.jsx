import { createContext, useContext, useEffect, useState } from 'react';

// Endpoints:
const API_LOGIN_USER = "https://packadive-backend.onrender.com/user/login";
const API_USER = "https://packadive-backend.onrender.com/user";

//Step 1
//Create the context
const AuthContext = createContext();

//Step 2
//Create useAuth hook to consume this context
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
}

//Step 3
export const AuthProvider = ({ children }) => {
  const [auth_token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  //Grab already logged in user
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(JSON.parse(savedToken));
      setUser(JSON.parse(savedUser)) //parsing JSON object from LS
    }
  }, []);

  // Login function
  const login = async (user_name, password) => { //sending api request to login with email and password
    console.log('Send login request');

    const response = await fetch(API_LOGIN_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: user_name,
        password: password
      })
    });

    console.log("Response");
    const loginData = await response.json();
    console.log('Token data:', loginData);

    setToken(loginData.auth_token);
    setUser(loginData.user);
    localStorage.setItem("auth_token", loginData.auth_token);
    localStorage.setItem("user", JSON.stringify(loginData.user)); //transforming the user into json readable string
  }

  const registerUser = async (email, password, user_name) => {
    const response = await fetch(API_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        user_name: user_name
      })
    })
    const responseData = await response.json();
    console.log(responseData);
  }

  const updateUser = async (updateData) => {
    const response = await fetch(API_USER, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      },
      body: JSON.stringify(updateData)
    })
    const updatedUserData = await response.json();
    console.log(updatedUserData);
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }

  const logout = () => {
    setToken(null); //clearing saved tokens
    setUser(null)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  const deleteUser = async () => {
    const response = await fetch(API_USER, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + auth_token
      }
    });
    const responseData = await response.json();
    console.log(responseData);
    logout();
  }

  const value = {
    auth_token,
    user,
    login,
    logout,
    registerUser,
    updateUser,
    deleteUser,
    isAuthenticated: auth_token ? true : false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

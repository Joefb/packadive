import { createContext, useContext, useEffect, useState } from 'react';

// Endpoints:
const API_LOGIN_USER = "http://127.0.0.1:5000/user/login";
const API_REGISTER_USER = "http://127.0.0.1:5000/user";
const API_UPDATE_USER = "http://127.0.0.1:5000/user";
const API_DELETE_USER = "http://127.0.0.1:5000/user";

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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  //Grab already logged in user
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    setToken(savedToken);
    setUser(JSON.parse(savedUser)) //parsing JSON object from LS
  }, []);

  // Login function
  const login = async (email, password) => { //sending api request to login with email and password

    console.log('Send login request');

    // const response = await fetch("http://127.0.0.1:5000/users/login", {
    const response = await fetch(API_LOGIN_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    console.log("Response");
    const loginData = await response.json();
    console.log('Token data:', loginData);

    setToken(loginData.token);
    setUser(loginData.user);
    localStorage.setItem("token", loginData.token);
    localStorage.setItem("user", JSON.stringify(loginData.user)); //transforming the user into json readable string
  }

  const registerUser = async (registerUser) => {
    // const response = await fetch("http://127.0.0.1:5000/users", {
    const response = await fetch(API_REGISTER_USER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerUser)
    })
    const responseData = await response.json();
    console.log(responseData);
  }

  const updateUser = async (updateData) => {
    // const response = await fetch("http://127.0.0.1:5000/users", {
    const response = await fetch(API_UPDATE_USER, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(updateData)
    })
    const updatedUserData = await response.json();
    console.log(updatedUserData);
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  }

  const logout = () => {
    setToken(''); //clearing saved tokens
    setUser(null)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  const deleteUser = async () => {
    // const response = fetch("http://127.0.0.1:5000/users", {
    const response = fetch(API_DELETE_USER, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    const responseData = await response.json();
    console.log(responseData);
    logout();
  }

  const value = {
    token,
    user,
    login,
    logout,
    registerUser,
    updateUser,
    deleteUser,
    isAuthenticated: token ? true : false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

const UserHome = () => {
  const [lists, setLists] = useState([]);

  const fetchLists = async () => {
    const response = await fetch(API_UPDATE_USER, {
      method: 'GET',
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

  return (
    <div></div>
  )
}

export default UserHome

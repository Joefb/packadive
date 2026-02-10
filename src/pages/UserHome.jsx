import { useList } from '../contexts/ListContext';
import CheckList from '../components/CheckList';

const UserHome = () => {
  const { listData } = useList();

  return (
    <div>
      <h1>User Home</h1>
      <CheckList />
    </div>
  )
}

export default UserHome

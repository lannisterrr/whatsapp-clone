import './App.css';
import Login from './components/Login';
import useWindowSize from './hooks/useWindowSize';
import useAuthUser from './hooks/useAuthUser';
import Sidebar from './components/Sidebar';
import { Route, Redirect } from 'react-router-dom';
import Chat from './components/Chat';
export default function App() {
  const page = useWindowSize();
  const user = useAuthUser();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app" style={{ ...page }}>
      <Redirect to={page.isMobile ? '/chats' : '/'} />
      <div className="app__body">
        <Route path="room/:roomID">
          <Chat user={user} page={page} />
        </Route>
        <Sidebar user={user} page={page} />
      </div>
    </div>
  );
}

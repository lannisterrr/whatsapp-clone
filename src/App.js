import './App.css';
import Login from './components/Login';
import useWindowSize from './hooks/useWindowSize';
import useAuthUser from './hooks/useAuthUser';
import Sidebar from './components/Sidebar';
import { Route, Redirect } from 'react-router-dom';
import Chat from './components/Chat';

export default function App() {
  const page = useWindowSize();
  const { user, loading, error } = useAuthUser();

  if (loading) {
    return <div className="app">Checking sign-in...</div>;
  }

  if (!user) {
    return (
      <>
        <Redirect to="/" />
        <Login authError={error} />
      </>
    );
  }

  return (
    <div className="app" style={{ ...page }}>
      <Redirect to={page.isMobile ? '/chats' : '/'} />
      <div className="app__body">
        <Sidebar user={user} page={page} />
        <Route path="/room/:roomID">
          <Chat user={user} page={page} />
        </Route>
      </div>
    </div>
  );
}

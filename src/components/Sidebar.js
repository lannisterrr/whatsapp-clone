import { Avatar, IconButton } from '@material-ui/core';
import { Add, ExitToApp, SearchOutlined } from '@material-ui/icons';
import { auth } from '../firebase';
import './Sidebar.css';
import './SidebarList.css';

export default function Sidebar({ user, page }) {
  function handleSignOut() {
    auth.signOut();
  }
  return (
    <div
      className="sidebar"
      style={{
        minHeight: page.isMobile ? page.minHeight : 'auto',
      }}
    >
      <div className="sidebar__header">
        <div className="sidebar__header--left">
          <Avatar src={user?.photoURL} />
          <h4>{user?.displayName}</h4>
        </div>
        <div className="sidebar__header--right">
          <IconButton onClick={handleSignOut}>
            <ExitToApp />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <form className="sidebar__search--container">
          <SearchOutlined />
          <input
            type="text"
            placeholder="search for users or rooms"
            id="search"
          />
        </form>
      </div>

      <div className="sidebar__chat--addRoom">
        <IconButton>
          <Add />
        </IconButton>
      </div>
    </div>
  );
}

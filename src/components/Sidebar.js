import { useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import {
  Add,
  ExitToApp,
  Message,
  PeopleAlt,
  SearchOutlined,
} from '@material-ui/icons';
import { auth, createTimeStamp, db } from '../firebase';
import { NavLink } from 'react-router-dom';
import { Home } from '@material-ui/icons';
import './Sidebar.css';
import './SidebarList.css';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router-dom';
import SidebarList from './SidebarList';
import useRooms from '../hooks/useRooms';
import useUsers from '../hooks/useUsers';
import useChats from '../hooks/useChats';

export default function Sidebar({ user, page }) {
  const rooms = useRooms();
  const users = useUsers(user);
  const chats = useChats(user);
  const [searchResults, setSearchResults] = useState([]);
  const [menu, setMenu] = useState(1);
  const handleCreateRoom = () => {
    const roomName = prompt('What is your public room name ? ');
    if (roomName.trim()) {
      db.collection('rooms').add({
        name: roomName,
        timeStamp: createTimeStamp(),
      });
    }
  };

  async function handleSearchUserAndRooms(event) {
    event.preventDefault();
    const query = event.target.elements.search.value;
    const userSnapshot = await db
      .collection('users')
      .where('name', '==', query)
      .get();

    const roomSnapshot = await db
      .collection('rooms')
      .where('name', '==', query)
      .get();

    const userResults = userSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    const roomResults = roomSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const searchResult = [...userResults, ...roomResults];
    setMenu(4);
    setSearchResults(searchResult);
  }

  function handleSignOut() {
    auth.signOut();
  }

  let Nav;
  if (page.isMobile) {
    Nav = NavLink;
  } else {
    Nav = props => (
      <div
        className={`${props.activeClass ? 'sidebar__menu--selected' : ''} `}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    );
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
        <form
          onSubmit={handleSearchUserAndRooms}
          className="sidebar__search--container"
        >
          <SearchOutlined />
          <input
            type="text"
            placeholder="type full users or rooms name and press enter "
            id="search"
          />
        </form>
      </div>
      <div className="sidebar__menu">
        <Nav
          to="/chats"
          onClick={() => setMenu(1)}
          activeClass={menu === 1}
          activeClassName="sidebar__menu--selected"
        >
          <div className="sidebar__menu--home">
            <Home />
            <div className="sidebar__menu--line" />
          </div>
        </Nav>

        <Nav
          to="/rooms"
          onClick={() => setMenu(2)}
          activeClass={menu === 2}
          activeClassName="sidebar__menu--selected"
        >
          <div className="sidebar__menu--rooms">
            <Message />
            <div className="sidebar__menu--line" />
          </div>
        </Nav>

        <Nav
          to="/users"
          onClick={() => setMenu(3)}
          activeClass={menu === 3}
          activeClassName="sidebar__menu--selected"
        >
          <div className="sidebar__menu--users">
            <PeopleAlt />
            <div className="sidebar__menu--line" />
          </div>
        </Nav>
      </div>

      {page.isMobile ? (
        <Switch>
          <Route path="/chats">
            <SidebarList title="Chats" data={chats} />
          </Route>
          <Route path="/rooms">
            <SidebarList title="Rooms" data={rooms} />
          </Route>
          <Route path="/users">
            <SidebarList title="Users" data={users} />
          </Route>
          <Route path="/search">
            <SidebarList title="Search Results" data={searchResults} />
          </Route>
        </Switch>
      ) : menu === 1 ? (
        <SidebarList title="Chats" data={chats} />
      ) : menu === 2 ? (
        <SidebarList title="Rooms" data={rooms} />
      ) : menu === 3 ? (
        <SidebarList title="Users" data={users} />
      ) : menu === 4 ? (
        <SidebarList title="Search Results" data={searchResults} />
      ) : null}

      <div className="sidebar__chat--addRoom">
        <IconButton onClick={handleCreateRoom}>
          <Add />
        </IconButton>
      </div>
    </div>
  );
}

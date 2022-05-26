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

export default function Sidebar({ user, page }) {
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
        <form className="sidebar__search--container">
          <SearchOutlined />
          <input
            type="text"
            placeholder="search for users or rooms"
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
            <SidebarList />
          </Route>
          <Route path="/rooms">
            <SidebarList />
          </Route>
          <Route path="/users">
            <SidebarList />
          </Route>
          <Route path="/search">
            <SidebarList />
          </Route>
        </Switch>
      ) : menu === 1 ? (
        <SidebarList />
      ) : menu === 2 ? (
        <SidebarList />
      ) : menu === 3 ? (
        <SidebarList />
      ) : menu === 4 ? (
        <SidebarList />
      ) : null}

      <div className="sidebar__chat--addRoom">
        <IconButton onClick={handleCreateRoom}>
          <Add />
        </IconButton>
      </div>
    </div>
  );
}

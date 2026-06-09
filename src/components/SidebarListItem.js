import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import UserAvatar from './UserAvatar';

function SidebarListItem({ item }) {
  return (
    <NavLink
      className="sidebar__chat-link"
      activeClassName="active"
      to={`/room/${item.id}`}
    >
      <div className="sidebar__chat">
        <UserAvatar
          className="sidebar__chat-avatar"
          photoURL={item.photoURL}
          photo={item.photo}
          name={item.name}
          id={item.id}
        />
        <div className="sidebar__chat-info">
          <span className="sidebar__chat-name">{item.name}</span>
        </div>
      </div>
    </NavLink>
  );
}

export default memo(SidebarListItem);

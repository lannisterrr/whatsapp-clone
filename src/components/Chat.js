import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useRoom from '../hooks/useRoom';
import { Avatar, IconButton, Menu, MenuItem } from '@material-ui/core';
import { ArrowBack, AddPhotoAlternate, MoreVert } from '@material-ui/icons';
import ChatMessages from './ChatMessages';
import ChatFooter from './ChatFooter';
import MediaPreview from './MediaPreview';
import './Chat.css';

export default function Chat({ user, page }) {
  const [image, setImage] = useState(null);
  const [src, setSrc] = useState(''); // for the image preview
  const { roomID } = useParams();
  const history = useHistory();
  const room = useRoom(roomID, user.uid);

  function handleShowPreview(event) {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      // to get the source value use fileReader() api
      // The FileReader object lets web applications asynchronously read the contents of files
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSrc(reader.result);
      };
    }
  }

  function handleHidePreview() {
    setSrc('');
    setImage(null);
  }
  return (
    <div className="chat">
      <div style={{ height: page.height }} className="chat__background" />
      <div className="chat__header">
        {page.isMobile && (
          <IconButton onClick={history.goBack}>
            <ArrowBack />
          </IconButton>
        )}
        <div className="avatar__container">
          <Avatar src={room?.photoURL} />
        </div>
        <div className="chat__header--info">
          <h3 style={{ width: page.isMobile && page.width - 165 }}>
            {room?.name}
          </h3>
        </div>

        <div className="chat__header-right">
          <input
            id="image"
            style={{ display: 'none' }}
            accept="image/*"
            type="file"
            onChange={handleShowPreview}
          />

          <IconButton>
            <label style={{ cursor: 'pointer', height: 24 }} htmlFor="image">
              <AddPhotoAlternate />
            </label>
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>

          <Menu id="menu" keepMounted open={false}>
            <MenuItem>Delete Room</MenuItem>
          </Menu>
        </div>
      </div>

      <div className="chat__body-container">
        <div className="chat__body" style={{ height: page.height - 68 }}>
          <ChatMessages />
        </div>
      </div>
      <MediaPreview src={src} handleHidePreview={handleHidePreview} />
      <ChatFooter />
    </div>
  );
}

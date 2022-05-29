import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useRoom from '../hooks/useRoom';
import {
  Avatar,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { ArrowBack, AddPhotoAlternate, MoreVert } from '@material-ui/icons';
import ChatMessages from './ChatMessages';
import ChatFooter from './ChatFooter';
import MediaPreview from './MediaPreview';
import Compressor from 'compressorjs';
import { v4 as uuid } from 'uuid';
import './Chat.css';
import { audioStorage, createTimeStamp, db, storage } from '../firebase';
import useChatMessages from '../hooks/useChatMessages';

export default function Chat({ user, page }) {
  const [image, setImage] = useState(null);
  const [src, setSrc] = useState(''); // for the image preview
  const [input, setInput] = useState('');
  const [audioId, setAudioId] = useState(''); // keep the track of audio that's currently playing
  const [isDeleting, setDeleting] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const { roomID } = useParams();
  const history = useHistory();
  const messages = useChatMessages(roomID);
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

  async function handleDeleteRoom() {
    setOpenMenu(false);
    setDeleting(true);

    try {
      const roomRef = db.collection('rooms').doc(roomID);
      const roomMessages = await roomRef.collection('messages').get();
      const audioFiles = [];
      const imageFiles = [];

      roomMessages.docs.forEach(doc => {
        if (doc.data().audioName) {
          audioFiles.push(doc.data().audioName);
        } else if (doc.data().imageName) {
          imageFiles.push(doc.data().imageName);
        }
      });

      // to delete all of this with singular request use promise.all()

      await Promise.all([
        ...roomMessages.docs.map(doc => doc.ref.delete()),
        ...imageFiles.map(image => storage.child(image).delete()),
        ...audioFiles.map(audio => audioStorage.child(audio).delete()),

        db
          .collection('users')
          .doc(user.uid)
          .collection('chats')
          .doc(roomID)
          .delete(),
        roomRef.delete(),
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      // runs either way whether thery is an error or not
      setDeleting(false);
      page.isMobile ? history.goBack() : history.replace('/chats');
    }
  }

  function handleOnChange(event) {
    setInput(event.target.value);
  }

  async function handleSendMessage(event) {
    event.preventDefault();

    if (input.trim() || (input === '' && image)) {
      setInput('');
      if (image) {
        handleHidePreview();
      }
      const imageName = uuid();
      const newMessage = image
        ? {
            name: user.displayName,
            message: input,
            uid: user.uid,
            timestamp: createTimeStamp(),
            time: new Date().toUTCString(),
            imageUrl: 'uploading',
            imageName,
          }
        : {
            name: user.displayName,
            message: input,
            uid: user.uid,
            timestamp: createTimeStamp(),
            time: new Date().toUTCString(),
          };

      db.collection('users')
        .doc(user.uid)
        .collection('chats')
        .doc(roomID)
        .set({
          name: room.name,
          photoURL: room.photoURL || null,
          timestamp: createTimeStamp(),
        });

      const doc = await db
        .collection('rooms')
        .doc(roomID)
        .collection('messages')
        .add(newMessage);

      if (image) {
        new Compressor(image, {
          quality: 0.8,
          maxWidth: 1920,
          async success(result) {
            setSrc('');
            setImage(null);
            await storage.child(imageName).put(result);
            const url = await storage.child(imageName).getDownloadURL();
            db.collection('rooms')
              .doc(roomID)
              .collection('messages')
              .doc(doc.id)
              .update({
                imageUrl: url,
              });
          },
        });
      }
    }
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

          <IconButton onClick={event => setOpenMenu(event.currentTarget)}>
            <MoreVert />
          </IconButton>

          <Menu
            id="menu"
            anchorEl={openMenu}
            keepMounted
            open={Boolean(openMenu)}
            onClose={() => setOpenMenu(null)}
          >
            <MenuItem onClick={handleDeleteRoom}>Delete Room</MenuItem>
          </Menu>
        </div>
      </div>

      <div className="chat__body-container">
        <div className="chat__body" style={{ height: page.height - 68 }}>
          {messages && (
            <ChatMessages
              messages={messages}
              user={user}
              roomId={roomID}
              audioId={audioId}
              setAudioId={setAudioId}
            />
          )}
        </div>
      </div>
      <MediaPreview src={src} handleHidePreview={handleHidePreview} />
      <ChatFooter
        input={input}
        handleOnChange={handleOnChange}
        handleSendMessage={handleSendMessage}
        image={image}
        user={user}
        setImage={setImage}
        room={room}
        roomID={roomID}
        setAudioId={setAudioId}
      />

      {isDeleting && (
        <div className="chat__deleting">
          <CircularProgress />
        </div>
      )}
    </div>
  );
}

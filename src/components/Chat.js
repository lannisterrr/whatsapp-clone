import { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useRoom from '../hooks/useRoom';
import {
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import UserAvatar from './UserAvatar';
import { ArrowBack, AddPhotoAlternate, MoreVert } from '@material-ui/icons';
import ChatMessages from './ChatMessages';
import ChatFooter from './ChatFooter';
import MediaPreview from './MediaPreview';
import Compressor from 'compressorjs';
import { v4 as uuid } from 'uuid';
import './Chat.css';
import { audioStorage, createTimeStamp, db, storage } from '../firebase';
import useChatMessages from '../hooks/useChatMessages';
import createPreviewThumbnail from '../utils/createPreviewThumbnail';

function waitForPaint() {
  return new Promise(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      maxWidth: 800,
      success: resolve,
      error: reject,
    });
  });
}

export default function Chat({ user, page }) {
  const [image, setImage] = useState(null);
  const [src, setSrc] = useState('');
  const [input, setInput] = useState('');
  const [audioId, setAudioId] = useState('');
  const [isDeleting, setDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const previewUrlRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { roomID } = useParams();
  const history = useHistory();
  const messages = useChatMessages(roomID);
  const room = useRoom(roomID, user.uid);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages?.length]);

  function revokePreviewUrl() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
  }

  async function handleShowPreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = '';
    revokePreviewUrl();
    setImage(file);
    setIsPreviewLoading(true);
    setSrc('');

    try {
      const thumbUrl = await createPreviewThumbnail(file);
      previewUrlRef.current = thumbUrl;
      setSrc(thumbUrl);
    } catch (err) {
      console.error('[Chat] preview failed:', err);
      setImage(null);
    } finally {
      setIsPreviewLoading(false);
    }
  }

  function handleHidePreview() {
    if (isUploading) return;
    revokePreviewUrl();
    setSrc('');
    setImage(null);
    setIsPreviewLoading(false);
  }

  function hidePreviewOverlay() {
    setSrc('');
    setImage(null);
    setIsPreviewLoading(false);
  }

  async function updateUserChat() {
    await db
      .collection('users')
      .doc(user.uid)
      .collection('chats')
      .doc(roomID)
      .set({
        name: room.name,
        photoURL: room.photoURL || null,
        timestamp: createTimeStamp(),
      });
  }

  async function sendTextMessage(messageText) {
    await updateUserChat();
    await db
      .collection('rooms')
      .doc(roomID)
      .collection('messages')
      .add({
        name: user.displayName,
        message: messageText,
        uid: user.uid,
        timestamp: createTimeStamp(),
        time: new Date().toUTCString(),
      });
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
    if (isUploading) return;

    const hasText = input.trim();
    const hasImage = !!image;
    if (!hasText && !hasImage) return;

    const messageText = input;
    setInput('');

    if (!hasImage) {
      await sendTextMessage(messageText);
      return;
    }

    const fileToSend = image;
    const thumbnailUrl = previewUrlRef.current;
    hidePreviewOverlay();
    await waitForPaint();

    setIsUploading(true);
    let docRef = null;

    try {
      const compressed = await compressImage(fileToSend);
      const imageName = uuid();

      await updateUserChat();

      docRef = await db
        .collection('rooms')
        .doc(roomID)
        .collection('messages')
        .add({
          name: user.displayName,
          message: messageText,
          uid: user.uid,
          timestamp: createTimeStamp(),
          time: new Date().toUTCString(),
          imageUrl: 'uploading',
          imageName,
        });

      if (thumbnailUrl) {
        setUploadingImages(prev => ({ ...prev, [docRef.id]: thumbnailUrl }));
      }

      await storage.child(imageName).put(compressed);
      const url = await storage.child(imageName).getDownloadURL();
      await docRef.update({ imageUrl: url });
    } catch (err) {
      console.error('[Chat] image upload failed:', err);
      if (docRef) {
        await docRef.update({ imageUrl: 'error' });
      }
    } finally {
      setIsUploading(false);
      if (docRef) {
        setUploadingImages(prev => {
          const next = { ...prev };
          delete next[docRef.id];
          return next;
        });
      }
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
        previewUrlRef.current = null;
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
          <UserAvatar photoURL={room?.photoURL} photo={room?.photo} name={room?.name} id={room?.id} />
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
              audioId={audioId}
              setAudioId={setAudioId}
              uploadingImages={uploadingImages}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <MediaPreview
        src={src}
        isLoading={isPreviewLoading}
        isUploading={isUploading}
        onSend={handleSendMessage}
        handleHidePreview={handleHidePreview}
      />
      <ChatFooter
        input={input}
        handleOnChange={handleOnChange}
        handleSendMessage={handleSendMessage}
        image={image}
        isUploading={isUploading}
        user={user}
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

import { memo } from 'react';
import { CircularProgress } from '@material-ui/core';
import AudioPlayer from './AudioPlayer';
import formatMessageTime from '../utils/formatTime';

function ChatMessageItem({
  message,
  isSender,
  roomId,
  audioId,
  setAudioId,
  uploadPreview,
}) {
  const isUploading = message.imageUrl === 'uploading';
  const isError = message.imageUrl === 'error';
  const imageSrc = isError
    ? null
    : isUploading
      ? uploadPreview
      : message.imageUrl;

  return (
    <div className={`chat__message ${isSender ? 'chat__message--sender' : ''}`}>
      <span className="chat__name">{message.name}</span>
      {isError ? (
        <span className="chat__message--message chat__message--error">
          Failed to send image
        </span>
      ) : imageSrc ? (
        <div className={`image-container ${isUploading ? 'image-container--uploading' : ''}`}>
          <img src={imageSrc} alt="" loading="lazy" />
          {isUploading && (
            <div className="image__container--loader">
              <CircularProgress style={{ width: 40, height: 40 }} />
            </div>
          )}
        </div>
      ) : isUploading ? (
        <div className="image-container">
          <div className="image__container--loader">
            <CircularProgress style={{ width: 40, height: 40 }} />
          </div>
        </div>
      ) : null}

      {message.audioName ? (
        <AudioPlayer
          sender={isSender}
          id={message.id}
          audioUrl={message.audioUrl}
          audioId={audioId}
          setAudioId={setAudioId}
        />
      ) : (
        message.message && (
          <span className="chat__message--message">{message.message}</span>
        )
      )}

      <div className="chat__timestamp">{formatMessageTime(message.time)}</div>
    </div>
  );
}

export default memo(ChatMessageItem);

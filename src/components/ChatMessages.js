import { CircularProgress } from '@material-ui/core';
import AudioPlayer from './AudioPlayer';

export default function ChatMessages({ messages, user, roomId }) {
  console.log(messages, 'in ChatMessages');
  return messages.map(message => {
    console.log(message);
    const isSender = message.uid === user.uid;
    return (
      <div
        key={message.id}
        className={`chat__message ${isSender ? 'chat__message--sender' : ''}`}
      >
        <span className="chat__name">{message.name}</span>
        {message.imageUrl === 'uploading' ? (
          <div className="image-container">
            <div className="image__container--loader">
              <CircularProgress
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </div>
          </div>
        ) : message.imageUrl ? (
          <div className="image-container">
            <img src={message.imageUrl} alt={message.name} />
          </div>
        ) : null}

        {message.audioName ? (
          <AudioPlayer
            sender={isSender}
            roomId={roomId}
            id={message.id}
            audioUrl={message.audioUrl}
          />
        ) : (
          <span className="chat__message--message">{message.message}</span>
        )}

        <div className="chat__timestamp">{message.time}</div>
      </div>
    );
  });
}

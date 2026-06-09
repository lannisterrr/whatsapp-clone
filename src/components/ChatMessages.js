import { memo } from 'react';
import ChatMessageItem from './ChatMessageItem';

function ChatMessages({
  messages,
  user,
  audioId,
  setAudioId,
  uploadingImages = {},
}) {
  return messages.map(message => (
    <ChatMessageItem
      key={message.id}
      message={message}
      isSender={message.uid === user.uid}
      audioId={audioId}
      setAudioId={setAudioId}
      uploadPreview={uploadingImages[message.id]}
    />
  ));
}

export default memo(ChatMessages);

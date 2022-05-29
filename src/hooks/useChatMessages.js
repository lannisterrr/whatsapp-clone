import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

export default function useChatMessages(roomId) {
  const query = roomId
    ? db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
    : null;
  const [snapshot] = useCollection(query);

  const messages = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return messages;
}

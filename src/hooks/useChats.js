import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
export default function useChats(user) {
  // collection -> /users/user.id/chats

  const query = user
    ? db
        .collection('users')
        .doc(user.uid)
        .collection('chats')
        .orderBy('timestamp', 'desc')
    : null;

  const [snapshot] = useCollection(query);

  const chats = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
  return chats;
}

import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

export default function useChats(user, enabled = true) {
  const query =
    enabled && user
      ? db
          .collection('users')
          .doc(user.uid)
          .collection('chats')
          .orderBy('timestamp', 'desc')
      : null;

  const [snapshot, loading] = useCollection(query);

  if (!enabled) return [];
  if (loading && !snapshot) return undefined;

  return snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

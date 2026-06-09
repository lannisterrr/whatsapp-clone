import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

export default function useRooms(enabled = true) {
  const query = enabled
    ? db.collection('rooms').orderBy('timestamp', 'desc')
    : null;
  const [snapshot, loading] = useCollection(query);

  if (!enabled) return [];
  if (loading && !snapshot) return undefined;

  return snapshot?.docs.map(doc => ({
    id: doc.id,
    userID: doc.id,
    ...doc.data(),
  }));
}

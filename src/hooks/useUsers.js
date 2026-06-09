import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

export default function useUsers(user, enabled = true) {
  const query = enabled
    ? db.collection('users').orderBy('timestamp', 'desc')
    : null;
  const [snapshot, loading] = useCollection(query);

  if (!enabled) return [];
  if (loading && !snapshot) return undefined;

  const users = [];
  if (user && snapshot) {
    snapshot.docs.forEach(doc => {
      const id =
        doc.id > user.uid ? `${doc.id}${user.uid}` : `${user.uid}${doc.id}`;

      if (doc.id !== user.uid) {
        users.push({
          id,
          userID: doc.id,
          ...doc.data(),
        });
      }
    });
  }
  return users;
}

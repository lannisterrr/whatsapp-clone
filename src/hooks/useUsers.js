import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

// we have to make a unique conversation between user
// so id will be composite of current user and the other perso
export default function useUsers(user) {
  const query = db.collection('users').orderBy('timestamp', 'desc');
  const [snapshot] = useCollection(query);

  const users = [];

  // we have to make sure that we don't show the current user in the users tab
  if (user) {
    snapshot?.docs.forEach(doc => {
      const id =
        doc.id > user.id ? `${doc.id}${user.id}` : `${user.id}${doc.id}`;

      if (doc.id !== user.uid) {
        users.push({
          id,
          userId: doc.id,
          ...doc.data(),
        });
      }
    });
  }
  return users;
}

import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';

export default function useRooms() {
  const query = db.collection('rooms').orderBy('timestamp', 'desc');
  const [snapshot] = useCollection(query);

  // snapshot returns an array of all the documents in the query
  const rooms = snapshot?.docs.map(doc => ({
    id: doc.id,
    userID: doc.id,
    ...doc.data(), // spread whatever we get from database
  }));

  return rooms;
}

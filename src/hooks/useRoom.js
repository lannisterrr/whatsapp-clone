import { useDocument } from 'react-firebase-hooks/firestore';
import { db } from '../firebase';
import { resolvePhotoUrl } from '../utils/avatar';

export default function useRoom(roomId, userId) {
  const isUserRoom = roomId?.includes(userId);
  const doc = isUserRoom ? roomId?.replace(userId, '') : roomId;

  const [snapshot] = useDocument(
    doc ? db.collection(isUserRoom ? 'users' : 'rooms').doc(doc) : null
  );

  if (!snapshot?.exists) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    photoURL: resolvePhotoUrl(data?.photoURL, data?.photo),
  };
}

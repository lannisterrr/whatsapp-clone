// seperation of cocerns by using custom hooks
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, createTimeStamp, db } from '../firebase';

/**
 * (querying or interacting) on firestore requires - creating a 'ref' and deciding which operation to perform
 * get the collection with particular path and find it acc to user id -> db.collection('users').doc(user.uid)
 * we can get the data once -> ref.get() it returns a promise. use .then to get the data
 * use onSnapShotMethod() to get the data once
 * imp -> FIREBASE CALLS THE DOCUMENT A SNAPSHOT
 * TO set key value pair in a document use .set() method
 */

export default function useAuthUser() {
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      // if a 'users' data exist with our user id
      const ref = db.collection('users').doc(user.uid); // this doesn't perform the query
      ref.get().then(doc => {
        if (!doc.exists) {
          ref.set({
            name: user.displayName,
            photo: user.photoURL,
            timestamp: createTimeStamp(),
          });
        }
      });
    }
  }, [user]);

  return user;
}

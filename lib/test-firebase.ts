import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const testConnection = async () => {
  try {
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection successful!',
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};

import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";

export interface Snippet {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: Timestamp;
  author: string;
  authorName: string;
}

export const createSnippet = async (snippet: Omit<Snippet, "id">) => {
  const docRef = await addDoc(collection(db, "snippets"), {
    ...snippet,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getSnippetsByUser = async (userId: string) => {
  const q = query(
    collection(db, "snippets"),
    where("author", "==", userId),
    orderBy("createdAt", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Snippet[];
};

export const getSnippetById = async (id: string) => {
  const docRef = doc(db, "snippets", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Snippet;
  }
  return null;
};

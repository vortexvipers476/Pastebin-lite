import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Snippet } from "@/lib/firestore";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useSnippets = (languageFilter?: string) => {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSnippets([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "snippets"),
      where("author", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const snippetsData: Snippet[] = [];
      querySnapshot.forEach((doc) => {
        snippetsData.push({ id: doc.id, ...doc.data() } as Snippet);
      });
      
      const filtered = languageFilter
        ? snippetsData.filter((s) => s.language === languageFilter)
        : snippetsData;
        
      setSnippets(filtered);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, languageFilter]);

  return { snippets, loading };
};

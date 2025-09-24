"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createSnippet } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const languages = [
  "HTML", "JavaScript", "CSS", "Python", "Node.js", 
  "TypeScript", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust"
];

export default function CreateSnippet() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) {
    router.push("/");
    return null;
  }

  const handleSave = async () => {
    if (!title || !language || !code) {
      alert("Please fill all fields");
      return;
    }

    setSaving(true);
    try {
      const id = await createSnippet({
        title,
        language,
        code,
        author: user.uid,
        authorName: user.displayName || "Anonymous",
        createdAt: null as any,
      });
      router.push(`/p/${id}`);
    } catch (error) {
      console.error("Error creating snippet:", error);
      alert("Error creating snippet");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Snippet</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-2 font-medium">Title</label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter snippet title"
          />
        </div>
        <div>
          <label htmlFor="language" className="block mb-2 font-medium">Language</label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Code</label>
          <div className="border rounded-md overflow-hidden">
            <MonacoEditor
              height="400px"
              language={language.toLowerCase()}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Snippet"}
        </Button>
      </div>
    </div>
  );
        }

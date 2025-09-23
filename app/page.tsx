"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSnippets } from "@/hooks/useSnippets";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const languages = [
  "HTML", "JavaScript", "CSS", "Python", "Node.js", 
  "TypeScript", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust"
];

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [languageFilter, setLanguageFilter] = useState<string>("");
  const { snippets, loading } = useSnippets(languageFilter);

  if (authLoading) return <div>Loading...</div>;
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Welcome to Pastebin Clone</h1>
        <p>Please log in to create and view your snippets.</p>
        <Button onClick={() => router.push("/login")} className="mt-4">
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Snippets</h1>
        <div className="flex items-center space-x-4">
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => router.push("/create")}>
            Create New Snippet
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : snippets.length === 0 ? (
        <div className="text-center py-10">
          <p>No snippets found. Create your first snippet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <Card key={snippet.id}>
              <CardHeader>
                <CardTitle>{snippet.title}</CardTitle>
                <CardDescription>
                  {snippet.language} • {snippet.createdAt.toDate().toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 truncate">
                  {snippet.code.substring(0, 100)}...
                </p>
                <div className="mt-4">
                  <Link href={`/p/${snippet.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
          }

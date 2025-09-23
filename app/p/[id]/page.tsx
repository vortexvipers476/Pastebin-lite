"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSnippetById } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { FaCopy, FaShare } from "react-icons/fa";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function SnippetPage() {
  const params = useParams();
  const router = useRouter();
  const [snippet, setSnippet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      if (params.id) {
        const data = await getSnippetById(params.id as string);
        if (data) {
          setSnippet(data);
        } else {
          router.push("/");
        }
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [params.id, router]);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div>Loading...</div>;
  if (!snippet) return <div>Snippet not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{snippet.title}</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleShare}>
                <FaShare className="mr-2" /> Share
              </Button>
              <Button variant="outline" onClick={handleCopy}>
                <FaCopy className="mr-2" /> {copied ? "Copied!" : "Copy Code"}
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Language: {snippet.language} • Created: {snippet.createdAt.toDate().toLocaleDateString()} • Author: {snippet.authorName}
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <MonacoEditor
              height="400px"
              language={snippet.language.toLowerCase()}
              value={snippet.code}
              theme="vs-dark"
              options={{ readOnly: true }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
                }

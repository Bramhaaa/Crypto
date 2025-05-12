"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Lock, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface EncryptionResult {
  encryptedMessage: string;
  encryptedKey: string | number[];
  timestamp: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [result, setResult] = useState<EncryptionResult | null>(null);

  useEffect(() => {
    // Retrieve the encryption result from sessionStorage
    const storedResult = sessionStorage.getItem("encryptionResult");

    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error("Failed to parse encryption result:", error);
        toast({
          title: "Error",
          description: "Failed to load encryption result. Please try again.",
          variant: "destructive",
        });
        router.push("/encrypt");
      }
    } else {
      // If no result is found, redirect back to the encryption page
      toast({
        title: "No encryption data",
        description: "Please encrypt a message first.",
        variant: "destructive",
      });
      router.push("/encrypt");
    }
  }, [router, toast]);

  const handleDownload = () => {
    if (!result) return;

    const fileContent = JSON.stringify(result, null, 2);
    const blob = new Blob([fileContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `encrypted-message-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download complete",
      description: "Your encrypted message has been downloaded.",
    });
  };

  const handleCopyToClipboard = (
    text: string | number[] | any,
    label: string
  ) => {
    const textToCopy = typeof text === "string" ? text : JSON.stringify(text);
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: `${label} has been copied to your clipboard.`,
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Failed to copy to clipboard. Please try again.",
          variant: "destructive",
        });
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Lock className="h-6 w-6 mr-2" />
          <span className="font-bold">HybridCrypt</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Home
          </Link>
          <Link
            href="/encrypt"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Encrypt
          </Link>
          <Link
            href="/#about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center mb-6">
            <Link href="/encrypt" className="inline-flex items-center mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Encryption
            </Link>
            <h1 className="text-2xl font-bold">Encryption Results</h1>
          </div>

          {result ? (
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Encryption Complete</CardTitle>
                <CardDescription>
                  Your message has been successfully encrypted using hybrid
                  cryptography. Encrypted on {result.timestamp}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="message" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="message">Encrypted Message</TabsTrigger>
                    <TabsTrigger value="key">Encrypted Key</TabsTrigger>
                  </TabsList>
                  <TabsContent value="message" className="space-y-4 pt-4">
                    <div className="relative">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 font-mono text-sm overflow-x-auto">
                        {result.encryptedMessage}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          handleCopyToClipboard(
                            result.encryptedMessage,
                            "Encrypted message"
                          )
                        }
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Copy to clipboard</span>
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="key" className="space-y-4 pt-4">
                    <div className="relative">
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 font-mono text-sm overflow-x-auto">
                        {result.encryptedKey}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          handleCopyToClipboard(
                            result.encryptedKey,
                            "Encrypted key"
                          )
                        }
                      >
                        <Share2 className="h-4 w-4" />
                        <span className="sr-only">Copy to clipboard</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push("/encrypt")}
                >
                  Encrypt Another Message
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Results
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          )}
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} HybridCrypt. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { encryptMessage } from "@/lib/encryption";

export default function EncryptPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [hillKey, setHillKey] = useState("");
  const [rsaPublicKey, setRsaPublicKey] = useState("");
  const [rsaPrivateKey, setRsaPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendResponse, setBackendResponse] = useState("");

  useEffect(() => {
    // Fetch data from the backend to verify connectivity
    fetch("http://localhost:5001/api/test")
      .then((response) => response.text())
      .then((data) => {
        setBackendResponse(data);
        // Show success toast if backend is connected
        toast({
          title: "Backend Connected",
          description: "Successfully connected to the encryption backend.",
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Show warning toast if backend is not connected
        toast({
          title: "Backend Connection Failed",
          description:
            "The encryption backend is not available. Encryption will use the fallback method.",
          variant: "destructive",
        });
        setBackendResponse(
          "Backend connection failed. Will use fallback encryption method."
        );
      });
  }, [toast]);

  const handleEncrypt = async () => {
    if (!message) {
      toast({
        title: "Missing information",
        description: "Please enter a message to encrypt",
        variant: "destructive",
      });
      return;
    }

    if (!hillKey) {
      toast({
        title: "Missing information",
        description: "Please enter a Hill Cipher key",
        variant: "destructive",
      });
      return;
    }

    if (!rsaPublicKey) {
      toast({
        title: "Missing information",
        description: "Please enter RSA public key",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call our encryption function which will use the backend API
      // or fallback to simulated encryption if backend is unavailable
      const result = await encryptMessage(message, hillKey, rsaPublicKey);

      // Show success message
      toast({
        title: "Encryption successful",
        description:
          "Your message has been encrypted. Redirecting to results...",
      });

      // Store the result in sessionStorage to pass to the results page
      sessionStorage.setItem("encryptionResult", JSON.stringify(result));

      // Navigate to results page after a short delay to show the toast
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    } catch (error: any) {
      // Show detailed error message if available
      toast({
        title: "Encryption failed",
        description:
          error.message ||
          "There was an error encrypting your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomHillKey = () => {
    // Generate a random 2x2 matrix with determinant != 0
    let matrix;
    let determinant;

    do {
      const a = Math.floor(Math.random() * 25) + 1;
      const b = Math.floor(Math.random() * 25) + 1;
      const c = Math.floor(Math.random() * 25) + 1;
      const d = Math.floor(Math.random() * 25) + 1;

      matrix = [
        [a, b],
        [c, d],
      ];
      determinant = a * d - b * c;
    } while (
      determinant === 0 ||
      determinant % 2 === 0 ||
      determinant % 13 === 0
    );

    setHillKey(matrix.map((row) => row.join(" ")).join("\n"));
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
            href="https://github.com/Bramhaaa/Crypto"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center mb-6">
            <Link href="/" className="inline-flex items-center mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold">Encrypt Your Message</h1>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Hybrid Encryption</CardTitle>
              <CardDescription>
                Enter your message and encryption parameters to secure your data
                using Hill Cipher and RSA encryption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="message" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="message">Message</TabsTrigger>
                  <TabsTrigger value="hill">Hill Cipher Key</TabsTrigger>
                  <TabsTrigger value="rsa">RSA Parameters</TabsTrigger>
                </TabsList>
                <TabsContent value="message" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Your Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter the message you want to encrypt..."
                      className="min-h-[200px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="hill" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hill-key" className="flex items-center">
                        Hill Cipher Key Matrix
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-2"
                              >
                                <HelpCircle className="h-4 w-4" />
                                <span className="sr-only">
                                  Hill Cipher Key Info
                                </span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Enter a 2x2 matrix with values separated by
                                spaces and rows on new lines. The matrix must
                                have a determinant that is coprime with 26.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateRandomHillKey}
                      >
                        Generate Random Key
                      </Button>
                    </div>
                    <Textarea
                      id="hill-key"
                      placeholder="Enter a 2x2 matrix (e.g., '2 3\n1 4')"
                      className="font-mono"
                      value={hillKey}
                      onChange={(e) => setHillKey(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Format: Enter values separated by spaces, with each row on
                      a new line.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="rsa" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rsa-public">RSA Public Key</Label>
                      <Textarea
                        id="rsa-public"
                        placeholder="Enter RSA public key..."
                        className="font-mono min-h-[100px]"
                        value={rsaPublicKey}
                        onChange={(e) => setRsaPublicKey(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rsa-private">
                        RSA Private Key (Optional - only needed for decryption)
                      </Label>
                      <Textarea
                        id="rsa-private"
                        placeholder="Enter RSA private key (optional)..."
                        className="font-mono min-h-[100px]"
                        value={rsaPrivateKey}
                        onChange={(e) => setRsaPrivateKey(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button onClick={handleEncrypt} disabled={loading}>
                {loading ? "Encrypting..." : "Encrypt Message"}
              </Button>
            </CardFooter>
          </Card>
          <div className="mt-6">
            <h2 className="text-lg font-bold">Backend Response</h2>
            <p>{backendResponse}</p>
          </div>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">

          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">

          </Link>
        </nav>
      </footer>
    </div>
  );
}

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileUp, HelpCircle, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { decryptMessage } from "@/lib/encryption"
import { Input } from "@/components/ui/input"

export default function DecryptPage() {
  const { toast } = useToast()
  const [encryptedMessage, setEncryptedMessage] = useState("")
  const [encryptedKey, setEncryptedKey] = useState("")
  const [rsaPrivateKey, setRsaPrivateKey] = useState("")
  const [hillKey, setHillKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null)
  const [fileUploaded, setFileUploaded] = useState(false)

  const handleDecrypt = async () => {
    if (!encryptedMessage) {
      toast({
        title: "Missing information",
        description: "Please enter an encrypted message",
        variant: "destructive",
      })
      return
    }

    if (!rsaPrivateKey && !hillKey) {
      toast({
        title: "Missing information",
        description: "Please enter either the RSA private key or the Hill Cipher key",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real application, this would call your backend API
      // For now, we'll simulate decryption with a timeout
      const result = await decryptMessage(encryptedMessage, encryptedKey, rsaPrivateKey, hillKey)
      setDecryptedMessage(result.decryptedMessage)
    } catch (error) {
      toast({
        title: "Decryption failed",
        description: "There was an error decrypting your message. Please check your keys and try again.",
        variant: "destructive",
      })
      setDecryptedMessage(null)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const data = JSON.parse(content)

        if (data.encryptedMessage && data.encryptedKey) {
          setEncryptedMessage(data.encryptedMessage)
          setEncryptedKey(data.encryptedKey)
          setFileUploaded(true)

          toast({
            title: "File loaded",
            description: "Encrypted data has been loaded successfully.",
          })
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        toast({
          title: "Invalid file",
          description: "The selected file is not a valid encryption result file.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const clearResults = () => {
    setDecryptedMessage(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Lock className="h-6 w-6 mr-2" />
          <span className="font-bold">HybridCrypt</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
            Home
          </Link>
          <Link href="/encrypt" className="text-sm font-medium hover:underline underline-offset-4">
            Encrypt
          </Link>
          <Link href="/decrypt" className="text-sm font-medium hover:underline underline-offset-4">
            Decrypt
          </Link>
          <Link href="/#about" className="text-sm font-medium hover:underline underline-offset-4">
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
            <h1 className="text-2xl font-bold">Decrypt Your Message</h1>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Hybrid Decryption</CardTitle>
              <CardDescription>
                Enter your encrypted message and decryption parameters to recover your original data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {decryptedMessage ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Decrypted Message</Label>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 min-h-[200px] whitespace-pre-wrap">
                      {decryptedMessage}
                    </div>
                  </div>
                  <Button onClick={clearResults} className="w-full">
                    Decrypt Another Message
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <Label htmlFor="file-upload" className="block mb-2">
                      Upload Encryption File
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="max-w-sm"
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <HelpCircle className="h-4 w-4" />
                              <span className="sr-only">Upload Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Upload a JSON file containing encrypted message data that was previously downloaded from
                              the encryption results page.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {fileUploaded && (
                      <p className="text-sm text-green-600 mt-2">
                        <FileUp className="inline h-4 w-4 mr-1" />
                        File loaded successfully
                      </p>
                    )}
                  </div>

                  <Tabs defaultValue="message" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="message">Encrypted Message</TabsTrigger>
                      <TabsTrigger value="key">Encrypted Key</TabsTrigger>
                      <TabsTrigger value="params">Decryption Parameters</TabsTrigger>
                    </TabsList>
                    <TabsContent value="message" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="encrypted-message">Encrypted Message</Label>
                        <Textarea
                          id="encrypted-message"
                          placeholder="Enter the encrypted message..."
                          className="min-h-[200px] font-mono"
                          value={encryptedMessage}
                          onChange={(e) => setEncryptedMessage(e.target.value)}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="key" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="encrypted-key">Encrypted Hill Cipher Key</Label>
                        <Textarea
                          id="encrypted-key"
                          placeholder="Enter the RSA-encrypted Hill Cipher key..."
                          className="min-h-[150px] font-mono"
                          value={encryptedKey}
                          onChange={(e) => setEncryptedKey(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">
                          This is the Hill Cipher key that was encrypted with RSA during the encryption process.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="params" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="rsa-private">RSA Private Key</Label>
                          <Textarea
                            id="rsa-private"
                            placeholder="Enter your RSA private key to decrypt the Hill Cipher key..."
                            className="font-mono min-h-[150px]"
                            value={rsaPrivateKey}
                            onChange={(e) => setRsaPrivateKey(e.target.value)}
                          />
                          <p className="text-sm text-gray-500">
                            Required if you don't have the original Hill Cipher key.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="hill-key" className="flex items-center">
                              Hill Cipher Key Matrix
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                                      <HelpCircle className="h-4 w-4" />
                                      <span className="sr-only">Hill Cipher Key Info</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="max-w-xs">
                                      If you already know the original Hill Cipher key, you can enter it directly here
                                      instead of using the RSA private key.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </Label>
                          </div>
                          <Textarea
                            id="hill-key"
                            placeholder="Enter the original Hill Cipher key matrix (e.g., '2 3\n1 4')"
                            className="font-mono"
                            value={hillKey}
                            onChange={(e) => setHillKey(e.target.value)}
                          />
                          <p className="text-sm text-gray-500">
                            Format: Enter values separated by spaces, with each row on a new line.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </CardContent>
            {!decryptedMessage && (
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button onClick={handleDecrypt} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="mr-2">Decrypting...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Decrypt Message
                    </>
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
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
  )
}

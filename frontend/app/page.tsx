import Link from "next/link"
import { ArrowRight, Lock, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
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
          <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure Your Messages with Hybrid Cryptography
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Combining the power of Hill Cipher and RSA encryption for enhanced security and performance. Protect
                    your sensitive information with our state-of-the-art hybrid encryption system.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/encrypt">
                    <Button className="inline-flex items-center justify-center">
                      Start Encrypting
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#about">
                    <Button variant="outline" className="inline-flex items-center justify-center">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-full min-h-[300px] rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-grid-gray-500/20 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-gray-400/20"></div>
                  <div className="relative flex flex-col items-center text-center space-y-4">
                    <Lock className="h-16 w-16 text-gray-900 dark:text-gray-100" />
                    <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-lg">
                      <code className="text-sm font-mono">Encrypted: X7f2Qp9rT5sL8zK3</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our hybrid cryptography system combines symmetric and asymmetric encryption for optimal security and
                  performance.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-lg border p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Shield className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Hill Cipher</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    A symmetric encryption algorithm that uses matrix multiplication to transform plaintext into
                    ciphertext.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Lock className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">RSA Encryption</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    An asymmetric encryption algorithm that securely encrypts the Hill Cipher key for transmission.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-lg border p-4 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                  <Zap className="h-6 w-6 text-gray-900 dark:text-gray-100" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Hybrid Approach</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Combines the speed of symmetric encryption with the security of asymmetric encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
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

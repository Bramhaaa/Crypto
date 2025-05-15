import { NextRequest, NextResponse } from "next/server";
import { decryptMessage } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { encryptedMessage, encryptedKey, rsaPrivateKey, hillKey } = body;

    if (!encryptedMessage) {
      return NextResponse.json(
        { error: "Encrypted message is required" },
        { status: 400 }
      );
    }

    // Either Hill key or (encrypted key and RSA private key) must be provided
    if (!hillKey && !(encryptedKey && rsaPrivateKey)) {
      return NextResponse.json(
        {
          error:
            "Either Hill Cipher key or (encrypted key and RSA private key) must be provided",
        },
        { status: 400 }
      );
    }

    const result = await decryptMessage(
      encryptedMessage,
      encryptedKey || "",
      rsaPrivateKey || "",
      hillKey || ""
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to decrypt message" },
      { status: 500 }
    );
  }
}

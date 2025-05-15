import { NextRequest, NextResponse } from "next/server";
import { encryptMessage } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, hillKey, rsaPublicKey } = body;

    if (!message || !hillKey) {
      return NextResponse.json(
        { error: "Message and Hill Cipher key are required" },
        { status: 400 }
      );
    }

    const result = await encryptMessage(message, hillKey, rsaPublicKey || "");

    return NextResponse.json(result);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to encrypt message" },
      { status: 500 }
    );
  }
}

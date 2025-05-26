import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ContactMessage } from "@/models/ContactMessage";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  return NextResponse.json(messages);
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const messageId = searchParams.get("messageId");
  if (!messageId) {
    return NextResponse.json({ error: "Missing messageId" }, { status: 400 });
  }
  await ContactMessage.findByIdAndDelete(messageId);
  return NextResponse.json({ message: "Message deleted successfully" });
} 
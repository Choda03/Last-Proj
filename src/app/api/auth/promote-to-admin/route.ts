import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";

export async function POST() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: { role: "admin" } },
    { new: true }
  );
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ message: `User ${user.email} promoted to admin.`, user });
} 
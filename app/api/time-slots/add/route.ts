import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { start, end } = body;

  try {
    const client = await clientPromise;
    const db = client.db("app_db");
    const collection = db.collection("users_time_slots");

    await collection.updateOne(
      { user_id: user.id },
      {
        $push: {
          time_slots: {
            start,
            end,
            reminded: false,
          },
        },
        $setOnInsert: { email: user.email },
      } as any,
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add slot" }, { status: 500 });
  }
}

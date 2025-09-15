import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("app_db");
    const collection = db.collection("users_time_slots");

    const doc = await collection.findOne({ user_id: user.id });
    return NextResponse.json({ time_slots: doc?.time_slots || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch blocks" },
      { status: 500 }
    );
  }
}

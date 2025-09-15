import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;

async function sendReminder(email: string, durationMinutes: number) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "QuietHours <onboarding@resend.dev>",
      to: email,
      subject: "Quiet Hours Starting Soon",
      html: `<p>Your quiet hours will begin in <strong>10 minutes</strong> and last for <strong>${durationMinutes} minutes</strong>.</p>`,
    }),
  });
}

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("app_db");
    const collection = db.collection("users_time_slots");

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const users = await collection.find({}).toArray();

    for (const user of users) {
      const updatedSlots = user.time_slots.map((slot: any) => {
        const slotStart = slot.start.hour * 60 + slot.start.minute;
        const slotEnd = slot.end.hour * 60 + slot.end.minute;
        const duration = slotEnd - slotStart;
        const diff = slotStart - currentMinutes;

        if (currentMinutes >= slotStart) {
          slot.reminded = false;
        }

        if (!slot.reminded && diff > 0 && diff <= 10) {
          sendReminder(user.email, duration);
          slot.reminded = true;
        }

        return slot;
      });

      await collection.updateOne(
        { user_id: user.user_id },
        { $set: { time_slots: updatedSlots } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

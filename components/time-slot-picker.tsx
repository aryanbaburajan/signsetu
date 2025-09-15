"use client";

import { useEffect, useState } from "react";
import { TimeSlot, formatTo12HourString } from "@/lib/models/time";
import { Button } from "@/components/ui/button";
import { fromUTC, toUTC } from "@/lib/utils";

export default function TimeSlotPicker() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [newSlot, setNewSlot] = useState<TimeSlot>({
    start: { hour: 9, minute: 0 },
    end: { hour: 12, minute: 30 },
  });

  async function fetchTimeSlots() {
    const res = await fetch("/api/time-slots/get");
    const data = await res.json();

    const localSlots = data.time_slots.map((slot: TimeSlot) => ({
      start: fromUTC(slot.start),
      end: fromUTC(slot.end),
    }));

    setSlots(localSlots);
  }

  async function handleAddSlot() {
    const utcSlot: TimeSlot = {
      start: toUTC(newSlot.start),
      end: toUTC(newSlot.end),
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    setSlots([...slots, newSlot]);

    await fetch("/api/time-slots/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...utcSlot, timezone }),
    });
  }

  async function handleDeleteSlot(slot: TimeSlot) {
    const utcSlot: TimeSlot = {
      start: toUTC(slot.start),
      end: toUTC(slot.end),
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    setSlots(slots.filter((s) => s !== slot));

    await fetch("/api/time-slots/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...utcSlot, timezone }),
    });
  }

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  function handleTimeChange(
    field: "start" | "end",
    subField: "hour" | "minute",
    value: number
  ) {
    setNewSlot({
      ...newSlot,
      [field]: {
        ...newSlot[field],
        [subField]: value,
      },
    });
  }

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="space-y-4 p-4 max-w-md">
      <h1 className="text-xl font-bold">Pick Your Quiet Hours</h1>

      <div className="flex gap-2 items-center">
        <div>
          <label className="text-sm font-medium">Start</label>
          <div className="flex gap-1">
            <select
              value={newSlot.start.hour}
              onChange={(e) =>
                handleTimeChange("start", "hour", parseInt(e.target.value))
              }
              className="border rounded p-1"
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              value={newSlot.start.minute}
              onChange={(e) =>
                handleTimeChange("start", "minute", parseInt(e.target.value))
              }
              className="border rounded p-1"
            >
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">End</label>
          <div className="flex gap-1">
            <select
              value={newSlot.end.hour}
              onChange={(e) =>
                handleTimeChange("end", "hour", parseInt(e.target.value))
              }
              className="border rounded p-1"
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              value={newSlot.end.minute}
              onChange={(e) =>
                handleTimeChange("end", "minute", parseInt(e.target.value))
              }
              className="border rounded p-1"
            >
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={handleAddSlot}>Add</Button>
      </div>

      <div className="space-y-2">
        {slots.length === 0 && (
          <p className="text-gray-500 text-sm">No slots yet</p>
        )}
        {slots.map((slot, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border rounded p-2"
          >
            <span>
              {formatTo12HourString(slot.start)} –{" "}
              {formatTo12HourString(slot.end)}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteSlot(slot)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface Time {
  hour: number;
  minute: number;
}

export function formatTo12HourString(time: Time) {
  const hour = time.hour % 12 == 0 ? 12 : time.hour % 12;
  const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
  const suffix = time.hour < 12 ? "AM" : "PM";
  return `${hour}:${minute} ${suffix}`;
}

export interface TimeSlot {
  start: Time;
  end: Time;
}

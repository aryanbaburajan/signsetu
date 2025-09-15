import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toUTC(time: { hour: number; minute: number }) {
  const local = new Date();
  local.setHours(time.hour, time.minute, 0, 0);
  return {
    hour: local.getUTCHours(),
    minute: local.getUTCMinutes(),
  };
}

export function fromUTC(time: { hour: number; minute: number }) {
  const utc = new Date(Date.UTC(2000, 0, 1, time.hour, time.minute));
  return {
    hour: utc.getHours(),
    minute: utc.getMinutes(),
  };
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY;

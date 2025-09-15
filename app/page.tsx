import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import TimeSlotPicker from "@/components/time-slot-picker";
import { hasEnvVars } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>
        {user ? (
          <TimeSlotPicker />
        ) : (
          <div className="flex flex-col items-center justify-center w-full max-w-2xl p-6 mt-10 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-center shadow-sm">
            <h1 className="text-2xl font-semibold mb-2">Please log in!</h1>
            <p className="text-sm">
              You need to log in to view and manage your time slots.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

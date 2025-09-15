const NEXT_API_URL = Deno.env.get("NEXT_API_URL")!;

Deno.serve(async () => {
  try {
    const res = await fetch(`${NEXT_API_URL}/remind`, {
      method: "POST",
    });

    const data = await res.text();
    return new Response(data, { status: res.status });
  } catch (err) {
    console.error(err);
    return new Response("Failed to trigger reminder", { status: 500 });
  }
});

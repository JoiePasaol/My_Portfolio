import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const action = url.searchParams.get("action");

  if (!id || !action) {
    return new Response("Missing id or action", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { error } = await supabase
    .from("testimonials")
    .update({ status: action })
    .eq("id", id);

  if (error) {
    return new Response("Failed: " + error.message, { status: 500 });
  }

  return new Response(
    `<!DOCTYPE html>
    <html>
      <body style="font-family:sans-serif;text-align:center;padding:60px;background:#f9f9f9;">
        <h2 style="color:${action === 'approved' ? '#16a34a' : '#dc2626'}">
          ${action === 'approved' ? '✅ Testimonial Approved!' : '❌ Testimonial Declined!'}
        </h2>
        <p>The testimonial has been <strong>${action}</strong> successfully.</p>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
});
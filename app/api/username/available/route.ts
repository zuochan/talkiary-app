import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { username, userId } = json as {
      username: string
      userId?: string
    }

    // Validate input
    if (!username || typeof username !== "string") {
      return new Response(JSON.stringify({ message: "Username is required" }), {
        status: 400
      })
    }

    // Check environment variables
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error("Missing Supabase environment variables")
      return new Response(
        JSON.stringify({ message: "Server configuration error" }),
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    let query = supabaseAdmin
      .from("profiles")
      .select("username, user_id")
      .eq("username", username)

    if (userId) {
      // If userId is provided, exclude the current user from the check
      query = query.neq("user_id", userId)
    }

    const { data: usernames, error } = await query

    if (error) {
      console.error("Supabase query error:", error)
      return new Response(
        JSON.stringify({ message: "Database query failed" }),
        { status: 500 }
      )
    }

    return new Response(JSON.stringify({ isAvailable: !usernames.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    console.error("Username availability API error:", error)
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

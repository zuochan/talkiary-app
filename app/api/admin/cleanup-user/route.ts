import { Database } from "@/supabase/types"
import { createClient } from "@supabase/supabase-js"

export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { userId } = json as {
      userId: string
    }

    // Validate input
    if (!userId || typeof userId !== "string") {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
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

    console.log(`Cleaning up user data for: ${userId}`)

    // Delete workspaces first (due to foreign key constraints)
    const { error: workspaceError } = await supabaseAdmin
      .from("workspaces")
      .delete()
      .eq("user_id", userId)

    if (workspaceError) {
      console.error("Error deleting workspaces:", workspaceError)
    } else {
      console.log("Workspaces deleted successfully")
    }

    // Delete profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("user_id", userId)

    if (profileError) {
      console.error("Error deleting profile:", profileError)
    } else {
      console.log("Profile deleted successfully")
    }

    // Delete from auth.users using admin API
    const { error: authError } =
      await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return new Response(
        JSON.stringify({ message: "Failed to delete user from auth" }),
        { status: 500 }
      )
    } else {
      console.log("Auth user deleted successfully")
    }

    return new Response(
      JSON.stringify({
        message: "User data cleaned up successfully",
        userId: userId
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error: any) {
    console.error("User cleanup API error:", error)
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

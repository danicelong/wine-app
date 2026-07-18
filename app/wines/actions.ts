"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addWine(formData: FormData) {
  const supabase = await createClient();

  // Only logged-in users can add wines
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const name = (formData.get("name") as string)?.trim();
  if (!name) return; // name is required, quietly ignore empty submits

  const vintageRaw = formData.get("vintage") as string;
  const ratingRaw = formData.get("rating") as string;

  await supabase.from("wines").insert({
    name,
    winery: (formData.get("winery") as string)?.trim() || null,
    wine_type: (formData.get("wine_type") as string)?.trim() || null,
    notes: (formData.get("notes") as string)?.trim() || null,
    vintage: vintageRaw ? parseInt(vintageRaw, 10) : null,
    rating: ratingRaw ? parseInt(ratingRaw, 10) : null,
  });

  revalidatePath("/wines"); // refreshes the list so the new wine appears
}
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddWineForm from "./add-wine-form";

export default async function WinesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: wines } = await supabase
    .from("wines")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold">My Wines</h1>

      <AddWineForm />

      <section className="flex flex-col gap-3">
        {wines && wines.length > 0 ? (
          wines.map((wine) => (
            <article key={wine.id} className="rounded-xl border border-foreground/10 p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold">{wine.name}</h3>
                {wine.rating && (
                  <span className="text-sm">
                    {"★".repeat(wine.rating)}
                    <span className="opacity-30">{"★".repeat(5 - wine.rating)}</span>
                  </span>
                )}
              </div>
              <p className="text-sm opacity-70">
                {[wine.winery, wine.vintage, wine.wine_type].filter(Boolean).join(" · ")}
              </p>
              {wine.notes && <p className="mt-2 text-sm">{wine.notes}</p>}
            </article>
          ))
        ) : (
          <p className="text-center text-sm opacity-70">
            No wines yet. Add your first one above.
          </p>
        )}
      </section>
    </main>
  );
}
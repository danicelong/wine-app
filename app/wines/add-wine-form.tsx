"use client";

import { useRef, useTransition } from "react";
import { addWine } from "./actions";

export default function AddWineForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const inputClass =
    "rounded-md border border-foreground/20 bg-transparent px-3 py-2";

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await addWine(formData);
          formRef.current?.reset(); // clear the fields after saving
        });
      }}
      className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-4"
    >
      <h2 className="text-lg font-semibold">Add a wine</h2>

      <input name="name" required placeholder="Wine name *" className={inputClass} />
      <input name="winery" placeholder="Winery" className={inputClass} />

      <div className="flex gap-3">
        <input name="vintage" type="number" placeholder="Vintage" className={`w-1/2 ${inputClass}`} />
        <input name="wine_type" placeholder="Type (red, white…)" className={`w-1/2 ${inputClass}`} />
      </div>

      <input name="rating" type="number" min={1} max={5} placeholder="Rating (1–5)" className={inputClass} />
      <textarea name="notes" rows={3} placeholder="Tasting notes" className={inputClass} />

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-foreground px-4 py-2 font-medium text-background disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Add wine"}
      </button>
    </form>
  );
}
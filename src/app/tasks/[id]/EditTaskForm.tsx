"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

export function EditTaskForm({
  id,
  initialTitle,
  initialDescription,
}: {
  id: string;
  initialTitle: string;
  initialDescription: string;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [message, setMessage] = useState<string>("");

  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      setMessage("Updated successfully.");
      router.push("/tasks");
      router.refresh();
    },
    onError: (err) => {
      setMessage(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setMessage("Title is required");
      return;
    }

    updateTask.mutate({
      id,
      title: trimmedTitle,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div style={{ marginBottom: "1rem" }}>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <button type="submit" disabled={updateTask.isPending}>
        {updateTask.isPending ? "Saving..." : "Save changes"}
      </button>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
    </form>
  );
}

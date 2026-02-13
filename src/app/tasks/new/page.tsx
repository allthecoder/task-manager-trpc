"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";


export default function NewTaskPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const createTask = trpc.task.create.useMutation({
    onSuccess: () => {
      router.push("/tasks");
        router.refresh();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    createTask.mutate({
        title: title.trim(),
  ...(description.trim() ? { description: description.trim() } : {}),
    });

  }

  return (
    <main className="container">
        <div className="header">
        <div>
            <h1 className="title">Create task</h1>
            <p className="subtitle">Add a new task to the in-memory list.</p>
        </div>

        <button className="button" onClick={() => router.push("/tasks")}>
            Back
        </button>
        </div>

        <section className="card">
        <div className="cardBody">
            <form onSubmit={handleSubmit} className="form">
            <div>
                <div className="label">Title</div>
                <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div>
                <div className="label">Description</div>
                <textarea
                className="textarea"
                value={description}
                placeholder="Optional details..."
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {error ? <p className="messageError">{error}</p> : null}

            <button className="button" type="submit" disabled={createTask.isPending}>
                {createTask.isPending ? "Creating..." : "Create Task"}
            </button>
            </form>
        </div>
        </section>
    </main>
  );

}

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
  const [isOk, setIsOk] = useState<boolean>(false);

  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      setIsOk(true);
      setMessage("Task updated successfully.");
      router.push("/tasks");
      router.refresh();
    },
    onError: (err) => {
      setIsOk(false);
      setMessage(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setIsOk(false);
      setMessage("Please provide a title before saving.");
      return;
    }

    updateTask.mutate({
      id,
      title: trimmedTitle,
      ...(trimmedDescription ? { description: trimmedDescription } : {}),
    });
  }

  return (
    <section className="card">
      <div className="cardBody">
        <form onSubmit={handleSubmit} className="form">
          <div>
            <div className="label">Title</div>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Finish the report"
            />
          </div>

          <div>
            <div className="label">Description</div>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
            />
          </div>

          {message ? (
            <div className={`alert ${isOk ? "alertOk" : "alertError"}`}>
              {message}
            </div>
          ) : null}

          <div className="row">
            <button className="button" type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending ? "Saving..." : "Save changes"}
            </button>

            <button
              type="button"
              className="button"
              onClick={() => router.push("/tasks")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

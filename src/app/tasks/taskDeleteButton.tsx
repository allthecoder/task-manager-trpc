"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TaskDeleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => {
      setMessage("Deleted successfully.");
      router.refresh();
    },
    onError: (err) => {
      setMessage(err.message);
    },
  });

  return (
    <span style={{ marginLeft: "1rem" }}>
      <button
        onClick={() => deleteTask.mutate({ id: taskId })}
        disabled={deleteTask.isPending}
      >
        {deleteTask.isPending ? "Deleting..." : "Delete"}
      </button>

      {message && (
        <span style={{ marginLeft: "0.75rem" }}>
          {message}
        </span>
      )}
    </span>
  );
}

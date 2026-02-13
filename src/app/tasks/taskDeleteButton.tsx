"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TaskDeleteButton({ taskId }: { taskId: string }) {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [message, setMessage] = useState<string>("");
  const [isOk, setIsOk] = useState<boolean>(false);

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      setIsOk(true);
      setMessage("Deleted successfully.");
      await utils.task.listInfinite.invalidate();
      await utils.task.list.invalidate();
      router.refresh();
    },
    onError: (err) => {
      setIsOk(false);
      setMessage(err.message);
    },
  });

  return (
    <div className="row">
      <button
        className="button buttonDanger"
        onClick={() => deleteTask.mutate({ id: taskId })}
        disabled={deleteTask.isPending}
      >
        {deleteTask.isPending ? "Deleting..." : "Delete"}
      </button>

      {message ? (
        <span className={isOk ? "messageOk" : "messageError"}>{message}</span>
      ) : null}
    </div>
  );
}

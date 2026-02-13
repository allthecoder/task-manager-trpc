import Link from "next/link";
import { appRouter } from "@/server/root";
import { EditTaskForm } from "./EditTaskForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TaskEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const caller = appRouter.createCaller({});
  const task = await caller.task.getById({ id });

  return (
    <main style={{ padding: "2rem" }}>
      <p>
        <Link href="/tasks">← Back to tasks</Link>
      </p>

      <h1>Edit Task</h1>

      <EditTaskForm
        id={task.id}
        initialTitle={task.title}
        initialDescription={task.description ?? ""}
      />
    </main>
  );
}

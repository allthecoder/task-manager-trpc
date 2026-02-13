export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { appRouter } from "@/server/root";
import { TaskDeleteButton } from "./taskDeleteButton";


export default async function TasksPage() {
  const caller = appRouter.createCaller({});
  const tasks = await caller.task.list();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Tasks</h1>
      <p>
        <Link href="/tasks/new">Create a task</Link>
      </p>

      {tasks.length === 0 && <p>No tasks yet.</p>}

      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <strong>{t.title}</strong>
            {t.description ? <p>{t.description}</p> : null}
            <p>
                <Link href={`/tasks/${t.id}`}>Edit</Link>
            </p>
            <TaskDeleteButton taskId={t.id} />
            <small>Created at: {new Date(t.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </main>
  );
}

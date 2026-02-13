export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { appRouter } from "@/server/root";
import { EditTaskForm } from "./EditTaskForm";

type PageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function TaskEditPage(props: PageProps) {
  const resolvedParams = await props.params;
  const id = resolvedParams.id;

  const caller = appRouter.createCaller({});
  const task = await caller.task.getById({ id });

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="title">Edit task</h1>
          <p className="subtitle">Update title and description.</p>
        </div>

        <Link className="button" href="/tasks">
          Back
        </Link>
      </div>

      <EditTaskForm
        id={task.id}
        initialTitle={task.title}
        initialDescription={task.description ?? ""}
      />
    </main>
  );
}

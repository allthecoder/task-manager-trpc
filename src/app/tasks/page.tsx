export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { appRouter } from "@/server/root";
import { TaskDeleteButton } from "./taskDeleteButton";

export default async function TasksPage() {
  const caller = appRouter.createCaller({});
  const tasks = await caller.task.list();

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="title">Tasks</h1>
          <p className="subtitle">A simple in-memory task manager.</p>
        </div>

        <Link className="button" href="/tasks/new">
          + Create task
        </Link>
      </div>

      <section className="card">
        <div className="cardBody">
          <div style={{ width: "100%" }}>
            {tasks.length === 0 ? (
              <p className="subtitle" style={{ margin: 0 }}>
                No tasks yet.
              </p>
            ) : (
              <div className="stack">
                {tasks.map((t) => (
                  <div key={t.id} className="taskCard">
                    <div className="taskTop">
                      <div>
                        <p className="taskTitle">{t.title}</p>
                        {t.description ? (
                          <p className="taskDesc">{t.description}</p>
                        ) : null}
                      </div>

                      <div className="taskMeta">
                        Created at: {new Date(t.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="row">
                      <Link className="button" href={`/tasks/${t.id}`}>
                        Edit
                      </Link>

                      <TaskDeleteButton taskId={t.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { appRouter } from "@/server/root";
import { TaskList } from "./TaskList";

export default async function TasksPage() {
  const caller = appRouter.createCaller({});

  const PAGE_SIZE = 5;

  const firstPage = await caller.task.listInfinite({
    limit: PAGE_SIZE,
    cursor: null,
  });

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
          {firstPage.items.length === 0 ? (
            <p className="subtitle" style={{ margin: 0 }}>
              No tasks yet.
            </p>
          ) : (
            <TaskList
              initialItems={firstPage.items}
              initialNextCursor={firstPage.nextCursor}
              pageSize={PAGE_SIZE}
            />
          )}
        </div>
      </section>
    </main>
  );
}

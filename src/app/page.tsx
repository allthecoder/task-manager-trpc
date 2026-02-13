import { appRouter } from "@/server/root";

export default async function Home() {
  const caller = appRouter.createCaller({});
  const tasks = await caller.task.list();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Task List</h1>

      {tasks.length === 0 && <p>No tasks yet.</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "1rem" }}>
            <strong>{task.title}</strong>
            {task.description && <p>{task.description}</p>}
            <small>
              Created at: {task.createdAt.toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </main>
  );
}

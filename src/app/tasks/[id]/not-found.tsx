import Link from "next/link";

export default function TaskNotFound() {
  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="title">Task not found</h1>
          <p className="subtitle">
            The task you are trying to edit does not exist (it may have been deleted).
          </p>
        </div>

        <Link className="button" href="/tasks">
          Back
        </Link>
      </div>

      <section className="card">
        <div className="cardBody">
          <div className="taskCard">
            <p className="taskTitle" style={{ margin: 0 }}>
              We couldn’t find this task.
            </p>
            <p className="taskDesc" style={{ margin: 0 }}>
              Go back to the task list and select an existing item.
            </p>

            <div className="row" style={{ marginTop: 8 }}>
              <Link className="button" href="/tasks">
                Go to tasks
              </Link>
              <Link className="button" href="/tasks/new">
                Create a new task
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

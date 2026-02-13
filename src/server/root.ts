import { router, publicProcedure } from "./trpc";
import { taskRouter } from "./task.router";

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello World";
  }),
  task: taskRouter,
});

export type AppRouter = typeof appRouter;
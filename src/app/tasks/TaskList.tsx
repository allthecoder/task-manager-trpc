"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/trpc/client";
import { TaskDeleteButton } from "./taskDeleteButton";

type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
};

const WINDOW_SIZE = 5;
const ITEM_HEIGHT = 110; // must match .taskCard height

export function TaskList({
  initialItems,
  initialNextCursor,
  pageSize,
}: {
  initialItems: Task[];
  initialNextCursor: number | null;
  pageSize: number;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [windowStart, setWindowStart] = useState(0);
  const [hasUserScrolled, setHasUserScrolled] = useState(false);

  const query = trpc.task.listInfinite.useInfiniteQuery(
    { limit: pageSize },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialData: {
        pages: [{ items: initialItems, nextCursor: initialNextCursor }],
        pageParams: [null],
      },
      refetchOnWindowFocus: false,
    }
  );

  const allItems = useMemo(() => {
    return query.data?.pages.flatMap((p) => p.items) ?? [];
  }, [query.data]);

  const visibleCount = Math.min(WINDOW_SIZE, Math.max(1, allItems.length));
  const totalHeight =
  (allItems.length + (query.hasNextPage ? 1 : 0)) * ITEM_HEIGHT;
  const scrollBuffer = query.hasNextPage ? Math.floor(ITEM_HEIGHT * 0.6) : 0;
  const boxHeight = visibleCount * ITEM_HEIGHT + scrollBuffer;

  // visible window slice
  const visible = useMemo(() => {
    const start = Math.min(
      windowStart,
      Math.max(0, allItems.length - WINDOW_SIZE)
    );
    const end = Math.min(allItems.length, start + WINDOW_SIZE);

    return allItems.slice(start, end).map((task, i) => ({
      task,
      index: start + i,
    }));
  }, [allItems, windowStart]);

  // scroll handler
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setHasUserScrolled(true);
      const start = Math.floor(el.scrollTop / ITEM_HEIGHT);
      setWindowStart(start);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // fetch more only after user scrolls
  useEffect(() => {
    if (!hasUserScrolled) return;

    const nearEnd = windowStart + WINDOW_SIZE >= allItems.length - 2;

    if (nearEnd && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [
    hasUserScrolled,
    windowStart,
    allItems.length,
    query.hasNextPage,
    query.isFetchingNextPage,
    query.fetchNextPage,
  ]);

  return (
    <div style={{ width: "100%" }}>
      <div
        ref={scrollRef}
        className="scrollBoxWindow"
        style={{ height: boxHeight }}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          {visible.map(({ task, index }) => (
            <div
              key={task.id}
              style={{
                position: "absolute",
                top: index * ITEM_HEIGHT,
                left: 0,
                right: 0,
              }}
            >
              <div className="taskCard">
                <div className="taskTop">
                  <div>
                    <p className="taskTitle">{task.title}</p>
                    {task.description ? (
                      <p className="taskDesc">{task.description}</p>
                    ) : null}
                  </div>

                  <div className="taskMeta">
                    {new Date(task.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="row">
                  <Link className="button" href={`/tasks/${task.id}`}>
                    Edit
                  </Link>

                  <TaskDeleteButton taskId={task.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {query.isFetchingNextPage ? (
        <div
            style={{
            position: "absolute",
            top: allItems.length * ITEM_HEIGHT,
            left: 0,
            right: 0,
            padding: "10px 0",
            textAlign: "center",
            }}
        >
            <span className="badge">
            {query.isFetchingNextPage ? "Loading…" : "Scroll to load more"}
            </span>
        </div>) : null}
    </div>
  );
}

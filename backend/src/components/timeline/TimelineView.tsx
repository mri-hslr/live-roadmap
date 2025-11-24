import React, { useEffect, useRef } from "react";
import { DataSet } from "vis-data/esnext";
import { Timeline } from "vis-timeline/esnext";

import "vis-timeline/styles/vis-timeline-graph2d.min.css";

/**
 * TimelineView: renders tasks using vis-timeline.
 * - tasks prop contains Task documents from backend.
 * - socket: socket object for emitting updates.
 *
 * Strategy:
 * - Convert tasks to vis items dataset
 * - Listen for 'move' event (drag/resizes) and do optimistic update + socket emit
 * - Listen for select to show details via Sidebar (handled in parent)
 */
export default function TimelineView({ tasks, socket }: any) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<any>(new DataSet([]));
  const timelineRef = useRef<any>(null);
  const versionMap = useRef<Record<string, number>>({});

  useEffect(() => {
    // initialize dataset from tasks
    itemsRef.current.clear();
    tasks.forEach((t: any) => {
      itemsRef.current.add({
        id: t._id,
        content: `${t.content} (${t.team})`,
        start: new Date(t.start),
        end: new Date(t.end)
      });
      versionMap.current[t._id] = t.version;
    });
  }, [tasks]);

  useEffect(() => {
    if (!containerRef.current) return;
    const options = {
      stack: false,
      editable: { add: false, updateTime: true, updateGroup: false },
      margin: { item: 10 }
    };
    timelineRef.current = new Timeline(containerRef.current, itemsRef.current, options);

    timelineRef.current.on('move', (props: any) => {
      // props: { item, start, end, oldStart, oldEnd }
      const id = props.item;
      const start = props.start.toISOString();
      const end = props.end.toISOString();

      // optimistic update is already reflected in vis UI
      // send update to server with current baseVersion
      const baseVersion = versionMap.current[id] || 0;
      // emit to socket
      if (socket && socket.connected) {
        socket.emit('client:update_task', { id, start, end, baseVersion, editor: 'guest' });
      }
    });

    timelineRef.current.on('dragStart', (props: any) => {
      if (socket) socket.emit('client:editing', { itemId: props.item, editing: true, user: { name: 'guest' } });
    });
    timelineRef.current.on('dragEnd', (props: any) => {
      if (socket) socket.emit('client:editing', { itemId: props.item, editing: false, user: { name: 'guest' } });
    });

    return () => { timelineRef.current.destroy(); };
  }, [containerRef.current, socket]);

  return (
    <div className="timeline-container" ref={containerRef} style={{ height: 600 }} />
  );
}

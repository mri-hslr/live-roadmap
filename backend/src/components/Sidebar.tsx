import React, { useState } from "react";
import SnapshotModal from "./SnapshotModal";

export default function Sidebar({ tasks, socket, editing }: any) {
  const [showSnapModal, setShowSnapModal] = useState(false);

  // --- Create new task ---
  function createTask() {
    const now = new Date();
    const payload = {
      content: "New Task",
      start: now.toISOString(),
      end: new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString(),
      team: "Unassigned",
      points: 10
    };

    socket?.emit("client:create_task", payload);
  }

  // --- Export CSV ---
  function exportCSV() {
    window.open("http://localhost:4000/api/roadmap/export/csv");
  }

  // --- Capacity Calculation ---
  const teamMap: Record<string, { points: number; count: number }> = {};
  tasks.forEach((t: any) => {
    if (!teamMap[t.team]) teamMap[t.team] = { points: 0, count: 0 };
    teamMap[t.team].points += t.points || 0;
    teamMap[t.team].count += 1;
  });

  return (
    <div className="bg-white p-4 rounded shadow h-full">
      <button
        className="w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700 transition"
        onClick={createTask}
      >
        + Create Task
      </button>

      <button
        className="w-full bg-gray-700 text-white py-2 rounded mb-3 hover:bg-gray-800 transition"
        onClick={exportCSV}
      >
        Export as CSV
      </button>

      <button
        className="w-full bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700 transition"
        onClick={() => setShowSnapModal(true)}
      >
        Save Snapshot
      </button>

      <h3 className="mt-4 font-semibold text-lg">Capacity Summary</h3>

      <div className="mt-2">
        {Object.keys(teamMap).length === 0 && (
          <p className="text-sm text-gray-500">No tasks yet</p>
        )}

        {Object.entries(teamMap).map(([team, info]) => (
          <div key={team} className="mt-2 p-2 border rounded">
            <div className="flex justify-between text-sm font-medium">
              <span>{team}</span>
              <span>{info.points} pts</span>
            </div>
            <p className="text-xs text-gray-500">{info.count} tasks</p>
          </div>
        ))}
      </div>

      {/* Snapshot Modal */}
      <SnapshotModal
        open={showSnapModal}
        onClose={() => setShowSnapModal(false)}
        onSaved={() => alert("Snapshot saved!")}
      />
    </div>
  );
}

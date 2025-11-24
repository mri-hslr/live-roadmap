import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import AppLayout from "../Layout/AppLayout";
import Card from "../components/UI/Card";
import TimelineView from "../components/timeline/TimelineView"; 
import { getSocket } from "../services/socket";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function RoadmapPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = React.useState<any[]>([]);
  const socket = getSocket();

  // ------------------------------
  // FETCH TASKS INITIALLY
  // ------------------------------
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "/api/tasks",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    }
    fetchData();
  }, []);

  // ------------------------------
  // REAL-TIME UPDATES
  // ------------------------------
  useEffect(() => {
    if (!socket) return;

    socket.on("server:task_updated", (updatedTask: any) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    });

    socket.on("server:task_created", (newTask: any) => {
      setTasks((prev) => [...prev, newTask]);
    });

    return () => {
      socket.off("server:task_updated");
      socket.off("server:task_created");
    };
  }, [socket]);

  // ------------------------------
  // BUTTON HANDLERS
  // ------------------------------

  async function handleCreateTask() {
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/tasks",
        {
          content: "New Task",
          team: "Unassigned",
          start: new Date(Date.now()).toISOString(),
          end: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (socket && socket.connected) {
        socket.emit("client:create_task", res.data);
      }
      
    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  }

  function exportCSV() {
    if(socket && socket.connected){
        socket.emit("client:export_csv");
    }
    
    alert("CSV export triggered!");
  }

  function saveSnapshot() {
    if(socket && socket.connected){
        socket.emit("client:save_snapshot", { user: user?.name || "Guest" });

    }
    alert("Snapshot saved!");
  }

  // ------------------------------
  // UI STARTS HERE
  // ------------------------------

  return (
    <AppLayout>
      <Navbar />

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-brand-gradient">
        Roadmap Overview
      </h1>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* LEFT: TIMELINE */}
        <div className="lg:col-span-3">
          <Card>
            <h2 className="text-xl font-semibold mb-5">Timeline</h2>
            <TimelineView tasks={tasks} socket={socket} />
          </Card>
        </div>

        {/* RIGHT: CONTROL PANEL */}
        <div className="space-y-8">

          {/* ACTIONS */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Actions</h2>

            <button
              onClick={handleCreateTask}
              className="w-full py-3 mb-3 bg-brand text-white rounded-xl2 shadow-card hover:bg-brand-dark transition"
            >
              + Create Task
            </button>

            <button
              onClick={exportCSV}
              className="w-full py-3 mb-3 bg-gray-800 text-white rounded-xl2 shadow-card hover:bg-gray-900 transition"
            >
              Export as CSV
            </button>

            <button
              onClick={saveSnapshot}
              className="w-full py-3 bg-green-600 text-white rounded-xl2 shadow-card hover:bg-green-700 transition"
            >
              Save Snapshot
            </button>
          </Card>

          {/* CAPACITY SUMMARY */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Capacity Summary</h2>

            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Unassigned</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {tasks.length} tasks
                  </div>
                </div>
                <div className="font-bold">
                  {tasks.length * 10} pts
                </div>
              </div>
            </Card>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}

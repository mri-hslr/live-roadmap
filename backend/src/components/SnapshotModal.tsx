// src/components/SnapshotModal.tsx
import React, { useState } from "react";
import API from "../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SnapshotModal({ open, onClose, onSaved }: Props) {
  const [name, setName] = useState("");

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) return alert("Enter snapshot name");
    try {
      await API.post("/roadmap/snapshots", { name });
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save snapshot");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow w-96">
        <h2 className="text-xl font-bold mb-4">Save Snapshot</h2>

        <input
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Snapshot name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

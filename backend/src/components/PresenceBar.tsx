import React from 'react';

export default function PresenceBar({ presence }: any) {
  return (
    <div className="flex space-x-2 items-center">
      {presence.map((p:any) => (
        <div key={p.socketId || p.name} className="flex items-center space-x-2">
          <div style={{ background: p.color }} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs">{(p.name||'G').slice(0,1)}</div>
          <div className="text-sm">{p.name}</div>
        </div>
      ))}
    </div>
  );
}

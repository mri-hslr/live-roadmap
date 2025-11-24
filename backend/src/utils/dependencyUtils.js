// utility: if a task A depends on B and B shifts by delta, shift A as well recursively.
// returns list of updated tasks (ids and new start/end)
function shiftDependents(tasksMap, changedId, deltaMs) {
    const updated = [];
    // tasksMap: id -> task object
    const visited = new Set();
    function dfs(id) {
      for (const tId in tasksMap) {
        const task = tasksMap[tId];
        if (task.dependsOn && task.dependsOn.map(String).includes(String(id))) {
          if (visited.has(tId)) continue;
          visited.add(tId);
          // apply delta
          const newStart = new Date(new Date(task.start).getTime() + deltaMs);
          const newEnd = new Date(new Date(task.end).getTime() + deltaMs);
          task.start = newStart.toISOString();
          task.end = newEnd.toISOString();
          updated.push({ id: tId, start: task.start, end: task.end });
          dfs(tId);
        }
      }
    }
    dfs(changedId);
    return updated;
  }
  
  module.exports = { shiftDependents };
  
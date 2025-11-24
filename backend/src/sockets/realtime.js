/**
 * Socket.io handlers - server authoritative model
 *
 * Events:
 *  - connection (handled in index)
 *  - 'client:join' -> client joins with token or user info
 *  - 'client:update_task' -> client attempts to update a task: server validates, applies, broadcasts
 *  - 'client:create_task' -> create new task
 *  - 'client:editing' -> show editing presence per item
 *
 * Broadcasts:
 *  - 'server:task_updated' -> sends updated task
 *  - 'server:task_created'
 *  - 'server:presence'
 *  - 'server:editing'
 */

const Task = require('../models/task');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'devsecret';

async function attachRealtime(io) {
  const presence = {}; // socketId -> {name, role, color}
  io.on('connection', (socket) => {
    console.log('sock conn', socket.id);

    socket.on('client:join', async ({ token, tempName }) => {
      let user = null;
      if (token) {
        try {
          user = jwt.verify(token, secret);
        } catch (e) { user = null; }
      }
      // fallback guest user
      const info = user ? { id: user.id, name: user.name, role: user.role, color: '#'+Math.floor(Math.random()*16777215).toString(16) } : { name: tempName || 'Guest-'+socket.id.slice(0,4), role: 'viewer', color: '#'+Math.floor(Math.random()*16777215).toString(16) };
      presence[socket.id] = info;
      // emit presence to all
      io.emit('server:presence', Object.values(presence));
      // send current tasks
      const tasks = await Task.find({});
      socket.emit('server:init', tasks);
    });

    socket.on('client:create_task', async (payload) => {
      const t = new Task({
        content: payload.content || 'New Task',
        start: payload.start ? new Date(payload.start) : new Date(),
        end: payload.end ? new Date(payload.end) : new Date(Date.now() + 7*24*3600*1000),
        team: payload.team,
        dependsOn: payload.dependsOn || [],
        points: payload.points || 10
      });
      await t.save();
      io.emit('server:task_created', t);
    });

    socket.on('client:update_task', async (payload) => {
      // payload: { id, start, end, baseVersion, editor }
      try {
        const t = await Task.findById(payload.id);
        if (!t) {
          socket.emit('server:error', { message: 'Task not found' });
          return;
        }
        if (payload.baseVersion && payload.baseVersion !== t.version) {
          // version conflict: return current server task
          socket.emit('server:task_rejected', t);
          return;
        }

        const oldStart = t.start;
        if (payload.start) t.start = new Date(payload.start);
        if (payload.end) t.end = new Date(payload.end);
        if (payload.content) t.content = payload.content;
        if (payload.team) t.team = payload.team;
        if (payload.points != null) t.points = payload.points;
        if (payload.status) t.status = payload.status;
        if (payload.description) t.description = payload.description;
        if (payload.dependsOn) t.dependsOn = payload.dependsOn;

        t.version += 1;
        await t.save();

        // propagate to dependents (server side)
        const deltaMs = new Date(t.start).getTime() - new Date(oldStart).getTime();
        const updatedDependents = [];
        if (deltaMs !== 0) {
          const allTasks = await Task.find({});
          const map = {};
          allTasks.forEach(x => map[x._id] = {
            start: x.start.toISOString(), end: x.end.toISOString(), dependsOn: x.dependsOn
          });
          const { shiftDependents } = require('../utils/dependencyUtils'); // we could require at top
          const updates = shiftDependents(map, String(t._id), deltaMs);
          for (const u of updates) {
            const doc = await Task.findById(u.id);
            doc.start = new Date(u.start);
            doc.end = new Date(u.end);
            doc.version += 1;
            await doc.save();
            updatedDependents.push(doc);
          }
        }

        // broadcast authoritative update and any dependents
        io.emit('server:task_updated', { task: t, updatedDependents });
      } catch (err) {
        console.error('update task error', err);
        socket.emit('server:error', { message: 'server error' });
      }
    });

    socket.on('client:editing', (payload) => {
      // payload { itemId, editing, user }
      socket.broadcast.emit('server:editing', { socketId: socket.id, ...payload });
    });

    socket.on('disconnect', () => {
      delete presence[socket.id];
      io.emit('server:presence', Object.values(presence));
    });
  });
}

module.exports = attachRealtime;

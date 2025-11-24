const Task = require('../models/task');
const RoadmapSnapshot = require('../models/RoadmapSnapshot');
const { shiftDependents } = require('../utils/dependencyUtils');
const createCsvWriter = require('csv-writer').createObjectCsvStringifier;

/**
 * Basic CRUD and some special endpoints:
 * - get all tasks
 * - create task
 * - update task (with version check + dependency propagation)
 * - snapshot / list snapshots
 * - export CSV
 */

async function getTasks(req, res) {
  const tasks = await Task.find({});
  res.json(tasks);
}

async function createTask(req, res) {
  const body = req.body;
  const t = new Task({
    content: body.content || 'New Task',
    start: body.start ? new Date(body.start) : new Date(),
    end: body.end ? new Date(body.end) : new Date(Date.now() + 7*24*3600*1000),
    team: body.team || 'Unassigned',
    dependsOn: body.dependsOn || [],
    points: body.points || 10,
    description: body.description || '',
  });
  await t.save();
  res.json(t);
}

async function updateTask(req, res) {
  const { id } = req.params;
  const payload = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  // version check - prevents blind overwrite
  if (payload.baseVersion && payload.baseVersion !== task.version) {
    return res.status(409).json({ error: 'version_mismatch', serverTask: task });
  }

  // compute delta for dependencies if dates changed
  const oldStart = task.start;
  const oldEnd = task.end;

  if (payload.start) task.start = new Date(payload.start);
  if (payload.end) task.end = new Date(payload.end);
  if (payload.content) task.content = payload.content;
  if (payload.team) task.team = payload.team;
  if (payload.points != null) task.points = payload.points;
  if (payload.dependsOn) task.dependsOn = payload.dependsOn;
  if (payload.status) task.status = payload.status;
  if (payload.assignee) task.assignee = payload.assignee;
  if (payload.description) task.description = payload.description;

  task.version += 1;
  await task.save();

  // if start changed, shift dependents
  const deltaMs = new Date(task.start).getTime() - new Date(oldStart).getTime();
  const updatedDependents = [];
  if (deltaMs !== 0) {
    // load all tasks into map
    const allTasks = await Task.find({});
    const map = {};
    allTasks.forEach(t => map[t._id] = {
      start: t.start.toISOString(),
      end: t.end.toISOString(),
      dependsOn: t.dependsOn
    });
    const updates = shiftDependents(map, String(task._id), deltaMs);
    // apply updates to DB
    for (const u of updates) {
      const doc = await Task.findById(u.id);
      doc.start = new Date(u.start);
      doc.end = new Date(u.end);
      doc.version += 1;
      await doc.save();
      updatedDependents.push(doc);
    }
  }

  res.json({ task, updatedDependents });
}

async function snapshotRoadmap(req, res) {
  const { name } = req.body;
  const tasks = await Task.find({});
  const snap = new RoadmapSnapshot({ name: name || 'snapshot', createdBy: (req.user && req.user.name) || 'system', tasks });
  await snap.save();
  res.json(snap);
}

async function listSnapshots(req, res) {
  const snaps = await RoadmapSnapshot.find({}).sort({ createdAt: -1 });
  res.json(snaps);
}

async function exportCSV(req, res) {
  const tasks = await Task.find({});
  const csv = createCsvWriter({
    header: [
      { id: 'content', title: 'Content' },
      { id: 'start', title: 'Start' },
      { id: 'end', title: 'End' },
      { id: 'team', title: 'Team' },
      { id: 'points', title: 'Points' },
      { id: 'dependsOn', title: 'DependsOn' }
    ]
  });

  const records = tasks.map(t => ({
    content: t.content,
    start: t.start.toISOString(),
    end: t.end.toISOString(),
    team: t.team,
    points: t.points,
    dependsOn: (t.dependsOn || []).join(';')
  }));
  const csvString = csv.getHeaderString() + csv.stringifyRecords(records);
  res.setHeader('Content-disposition', 'attachment; filename=roadmap.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csvString);
}

module.exports = { getTasks, createTask, updateTask, snapshotRoadmap, listSnapshots, exportCSV };

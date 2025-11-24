const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, snapshotRoadmap, listSnapshots, exportCSV } = require('../controllers/roadmapController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// public read
router.get('/tasks', authMiddleware, getTasks);

// create/update require auth (editor+)
router.post('/tasks', authMiddleware, createTask);
router.put('/tasks/:id', authMiddleware, updateTask);

// snapshots
router.post('/snapshots', authMiddleware, snapshotRoadmap);
router.get('/snapshots', authMiddleware, listSnapshots);

// export
router.get('/export/csv', authMiddleware, exportCSV);

module.exports = router;

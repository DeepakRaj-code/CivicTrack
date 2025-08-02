import express from 'express';
import Issue from '../models/Issue.js';

const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const newIssue = new Issue(req.body);
    await newIssue.save();
    res.status(201).json({ message: 'Issue added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding issue' });
  }
});

// Get all issues by user name
router.get('/user/:name', async (req, res) => {
  try {
    const userName = req.params.name;
    const issues = await Issue.find({ name: userName });
    res.status(200).json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching issues' });
  }
});

export default router;

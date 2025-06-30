import express from 'express';
import MenuItem from '../models/MenuItem';
import adminAuth from '../middleware/adminAuth';

const router = express.Router();

// Add a new menu item
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update existing menu item
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Deactivate or remove menu item
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { hard } = req.query;
    let item;
    if (hard === 'true') {
      item = await MenuItem.findByIdAndDelete(req.params.id);
    } else {
      item = await MenuItem.findByIdAndUpdate(
        req.params.id,
        { active: false },
        { new: true }
      );
    }
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

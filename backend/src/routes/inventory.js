import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { prisma } from '../index.js';

const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const lowStockItems = await prisma.inventoryItem.findMany({
      where: {
        quantity: {
          lte: prisma.inventoryItem.fields.reorderLevel
        }
      },
      orderBy: {
        quantity: 'asc'
      }
    });
    
    res.json(lowStockItems);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Get items by category
router.get('/category/:category', 
  param('category').isIn(['MEDICINE', 'EQUIPMENT', 'SUPPLIES']).withMessage('Invalid category'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const items = await prisma.inventoryItem.findMany({
        where: {
          category: req.params.category
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Get a single inventory item by ID
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid item ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const item = await prisma.inventoryItem.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!item) {
        return res.status(404).json({ error: true, message: 'Inventory item not found' });
      }
      
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Create a new inventory item
router.post('/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').isIn(['MEDICINE', 'EQUIPMENT', 'SUPPLIES']).withMessage('Valid category is required'),
    body('unit').notEmpty().withMessage('Unit is required'),
    body('quantity').isInt({ min: 0 }).withMessage('Valid quantity is required'),
    body('reorderLevel').isInt({ min: 1 }).withMessage('Valid reorder level is required'),
    body('cost').isFloat({ min: 0 }).withMessage('Valid cost is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      const newItem = await prisma.inventoryItem.create({
        data: {
          name: req.body.name,
          category: req.body.category,
          description: req.body.description,
          unit: req.body.unit,
          quantity: req.body.quantity,
          reorderLevel: req.body.reorderLevel,
          cost: req.body.cost,
          supplier: req.body.supplier,
          expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : null,
          location: req.body.location
        }
      });
      
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Update an inventory item
router.put('/:id',
  [
    param('id').isUUID().withMessage('Invalid item ID'),
    body('quantity').optional().isInt({ min: 0 }).withMessage('Valid quantity is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if item exists
      const item = await prisma.inventoryItem.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!item) {
        return res.status(404).json({ error: true, message: 'Inventory item not found' });
      }
      
      // Update item
      const updatedItem = await prisma.inventoryItem.update({
        where: {
          id: req.params.id
        },
        data: {
          name: req.body.name || item.name,
          description: req.body.description || item.description,
          quantity: req.body.quantity !== undefined ? req.body.quantity : item.quantity,
          reorderLevel: req.body.reorderLevel || item.reorderLevel,
          cost: req.body.cost || item.cost,
          supplier: req.body.supplier || item.supplier,
          expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : item.expiryDate,
          location: req.body.location || item.location
        }
      });
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Delete an inventory item
router.delete('/:id',
  param('id').isUUID().withMessage('Invalid item ID'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {
      // Check if item exists
      const item = await prisma.inventoryItem.findUnique({
        where: {
          id: req.params.id
        }
      });
      
      if (!item) {
        return res.status(404).json({ error: true, message: 'Inventory item not found' });
      }
      
      // Delete item
      await prisma.inventoryItem.delete({
        where: {
          id: req.params.id
        }
      });
      
      res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

export default router;
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Sample in-memory data
let items = [
    { id: 1, name: 'Item 1', description: 'This is the first item' },
    { id: 2, name: 'Item 2', description: 'This is the second item' }
];


// 2. GET a single item by ID
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));

    if (!item) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }

    res.json({
        success: true,
        data: item
    });
});

// 1. GET all items
app.get('/api/items', (req, res) => {
    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedItems = items.slice(startIndex, endIndex);

    // Pagination metadata
    const total = items.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
        success: true,
        data: paginatedItems,
        page,
        count: paginatedItems.length,
        total,
        totalPages
    });
});

// 3. POST to create a new item
app.post('/api/items', (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'Name is required'
        });
    }

    const newItem = {
        id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
        name,
        description: description || ''
    };

    items.push(newItem);

    res.status(201).json({
        success: true,
        data: newItem
    });
});

// 4. PUT to update an item
app.put('/api/items/:id', (req, res) => {
    const { name, description } = req.body;
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));

    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }

    // Update the item
    const updatedItem = {
        ...items[itemIndex],
        ...name && { name },
        ...description && { description }
    };

    items[itemIndex] = updatedItem;

    res.json({
        success: true,
        data: updatedItem
    });
});

// 5. DELETE an item
app.delete('/api/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));

    if (itemIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Item not found'
        });
    }

    // Remove item from array
    items = items.filter(i => i.id !== parseInt(req.params.id));

    res.json({
        success: true,
        message: 'Item deleted successfully'
    });
});

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'Node.js API is running properly without DB.' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Handle all routes by trying to serve the corresponding HTML file
app.get('*', (req, res) => {
    let filePath = req.path;
    
    // Remove trailing slash
    if (filePath.endsWith('/')) {
        filePath = filePath.slice(0, -1);
    }
    
    // If no extension, assume it's a route and add .html
    if (!path.extname(filePath)) {
        filePath += '.html';
    }
    
    // Serve the index.html for the root path
    if (filePath === '.html') {
        filePath = 'index.html';
    }
    
    res.sendFile(path.join(__dirname, 'public', filePath));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 
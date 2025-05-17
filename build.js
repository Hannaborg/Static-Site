const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');
const frontMatter = require('front-matter');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

// Read the base template
const baseTemplate = fs.readFileSync('./src/templates/base.html', 'utf-8');

// Create build directory
fs.ensureDirSync('./public');
fs.ensureDirSync('./public/blog');

// Copy static assets
fs.copySync('./src/styles', './public/styles');

// Copy index.html directly
if (fs.existsSync('./src/index.html')) {
    fs.copySync('./src/index.html', './public/index.html');
}

// Process pages
const processPages = (dir, outputDir) => {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        // Skip processing index.md since we're using direct index.html
        if (file === 'index.md') return;
        
        if (path.extname(file) === '.md') {
            const content = fs.readFileSync(path.join(dir, file), 'utf-8');
            const { attributes, body } = frontMatter(content);
            const htmlContent = marked.parse(body);
            
            const finalHtml = baseTemplate
                .replace('{{title}}', attributes.title || 'My Site')
                .replace('{{content}}', htmlContent);
            
            const outputPath = path.join(outputDir, file.replace('.md', '.html'));
            fs.writeFileSync(outputPath, finalHtml);
        }
    });
};

// Process main pages
processPages('./src/content/pages', './public');

// Process blog posts
processPages('./src/content/blog', './public/blog');

console.log('Site built successfully!'); 
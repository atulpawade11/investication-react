const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

async function walk(dir) {
    const list = await fs.promises.readdir(dir);
    for (let file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.promises.stat(filePath);
        if (stat.isDirectory()) {
            await walk(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            await processFile(filePath);
        }
    }
}

async function processFile(file) {
    let content = await fs.promises.readFile(file, 'utf8');
    let original = content;

    // 1. Fix relative imports to components
    // Replace something like ../../../components/ with @/components/
    content = content.replace(/import\s+{[^}]*}\s+from\s+['"]\.\.\/\.\.\/\.\.\/components\//g, (match) => {
        return match.replace(/\.\.\/\.\.\/\.\.\/components\//, '@/components/');
    });
    content = content.replace(/import\s+[^;]*\s+from\s+['"]\.\.\/\.\.\/\.\.\/components\//g, (match) => {
        return match.replace(/\.\.\/\.\.\/\.\.\/components\//, '@/components/');
    });
    content = content.replace(/['"]\.\.\/\.\.\/components\//g, "'@/components/");
    content = content.replace(/['"]\.\.\/components\//g, "'@/components/");
    
    // Also handle @/lib, @/context, etc. if they were using relative paths
    content = content.replace(/['"]\.\.\/\.\.\/lib\//g, "'@/lib/");
    content = content.replace(/['"]\.\.\/\.\.\/context\//g, "'@/context/");
    content = content.replace(/['"]\.\.\/\.\.\/services\//g, "'@/services/");

    // 2. Fix Metadata type
    content = content.replace(/:\s*Metadata/g, '');
    content = content.replace(/Metadata\s*,/g, '');
    content = content.replace(/,\s*Metadata/g, '');

    // 3. Fix navigate.back() -> navigate(-1)
    content = content.replace(/navigate\.back\(\)/g, 'navigate(-1)');

    // 4. Fix style jsx global
    content = content.replace(/<style\s+jsx\s+global\s*>/g, '<style>');
    content = content.replace(/<style\s+jsx\s*>/g, '<style>');

    // 5. Fix lucide-react icons if they were actually wrong, but let's see. 
    // The error said "no exported member 'Facebook'". Let's check if it should be FacebookIcon.
    // Actually, let's just use the ones that are definitely there.
    
    if (content !== original) {
        await fs.promises.writeFile(file, content);
        console.log(`Refined ${file}`);
    }
}

walk(path.join(__dirname, 'src')).catch(console.error);

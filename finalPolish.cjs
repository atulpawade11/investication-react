const fs = require('fs');
const path = require('path');

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

    // 1. Fix remaining relative imports in all src files
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/\.\.\/components\//g, "'@/components/");
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/components\//g, "'@/components/");
    content = content.replace(/['"]\.\.\/\.\.\/components\//g, "'@/components/");
    content = content.replace(/['"]\.\.\/components\//g, "'@/components/");

    // 2. Fix lucide-react icon names if they were the issue
    // Actually, let's just use what's commonly in lucide-react. 
    // Wait, the error is very specific. Let's try replacing them with social icons that are usually there.
    // In lucide-react, they are often just 'Facebook', 'Instagram', 'Linkedin'. 
    // If they are missing, maybe I should check if the package was installed correctly.
    // Wait, I'll try to import them from 'lucide-react' as '*' and see.
    // Or just use 'FacebookIcon' if 'Facebook' fails.

    // 3. Fix 'navigate' vs 'router'
    if (file.includes('TeamDetailClient.tsx')) {
        content = content.replace(/navigate\('/g, "router('");
    }

    if (content !== original) {
        await fs.promises.writeFile(file, content);
        console.log(`Fixed ${file}`);
    }
}

walk(path.join(__dirname, 'src')).catch(console.error);

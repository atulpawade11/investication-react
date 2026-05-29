const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'Next_website', 'Sifs_Investigation', 'app');
const destDir = path.join(__dirname, 'src', 'pages');

async function copyMissingFiles(dir, currentRelPath = '') {
    const list = await fs.readdir(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
            await copyMissingFiles(filePath, path.join(currentRelPath, file));
        } else if (file.endsWith('.tsx') && file !== 'page.tsx' && file !== 'layout.tsx' && file !== 'loading.tsx') {
            const destPath = path.join(destDir, file);
            await fs.copy(filePath, destPath);
            console.log(`Copied ${file} to ${destPath}`);
        }
    }
}

async function run() {
    await fs.ensureDir(destDir);
    await copyMissingFiles(srcDir);
}

run().catch(console.error);

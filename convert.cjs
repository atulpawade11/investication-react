const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'Next_website', 'Sifs_Investigation');
const destDir = path.join(__dirname);
const destSrc = path.join(destDir, 'src');

async function copyFolders() {
  const folders = ['components', 'context', 'data', 'lib', 'services', 'types'];
  for (const folder of folders) {
    const src = path.join(srcDir, folder);
    const dest = path.join(destSrc, folder);
    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
      console.log(`Copied ${folder}`);
    }
  }
  
  // Copy public
  const srcPublic = path.join(srcDir, 'public');
  const destPublic = path.join(destDir, 'public');
  if (await fs.pathExists(srcPublic)) {
    await fs.copy(srcPublic, destPublic, { overwrite: true });
    console.log(`Copied public`);
  }
}

async function convertPages() {
  const appDir = path.join(srcDir, 'app');
  const pagesDir = path.join(destSrc, 'pages');
  await fs.ensureDir(pagesDir);
  
  // Find all page.tsx files recursively
  const files = [];
  async function walk(dir) {
    const list = await fs.readdir(dir);
    for (let file of list) {
      const filePath = path.join(dir, file);
      const stat = await fs.stat(filePath);
      if (stat.isDirectory()) {
        await walk(filePath);
      } else if (file === 'page.tsx') {
        files.push(filePath);
      }
    }
  }
  await walk(appDir);
  
  const routes = [];
  
  for (const file of files) {
    let relPath = path.relative(appDir, file);
    // Determine the route path
    let routePath = relPath.replace(/\\/g, '/').replace(/\/page\.tsx$/, '').replace(/^page\.tsx$/, '/');
    
    // Create a matching directory structure in pages/
    let targetFile;
    if (routePath === '/') {
        targetFile = path.join(pagesDir, 'Home.tsx');
        routePath = '/';
    } else {
        const parts = routePath.split('/');
        // For example, services/[category]/[slug] -> ServicesCategorySlug.tsx
        let componentName = parts.map(p => {
          return p.replace(/\[|\]/g, '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
        }).join('');
        
        targetFile = path.join(pagesDir, `${componentName}.tsx`);
    }
    
    // Read content and rewrite Next.js imports
    let content = await fs.readFile(file, 'utf8');
    
    // Remove 'use client'
    content = content.replace(/["']use client["'];?\s*/g, '');
    
    // Convert next/link to react-router-dom Link
    content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, 'import { Link } from "react-router-dom"');
    
    // Convert next/image to standard img
    content = content.replace(/import\s+Image\s+from\s+['"]next\/image['"]/g, '');
    content = content.replace(/<Image([^>]+)\/?>/g, (match, props) => {
       // Just change Image to img, remove priority, fill, etc. if needed
       let newProps = props.replace(/priority=\{?[^}]*\}?/g, '')
                           .replace(/fill(=\{[^}]*\})?/g, '')
                           .replace(/objectFit=["'][^"']*["']/g, '')
                           .replace(/layout=["'][^"']*["']/g, '');
       return `<img${newProps}/>`;
    });
    
    // Change navigation hooks
    if (content.includes('next/navigation')) {
      content = content.replace(/import\s+{[^}]*}\s+from\s+['"]next\/navigation['"]/g, 'import { useParams, useNavigate, useLocation } from "react-router-dom"');
      // replace usePathname() with useLocation().pathname
      content = content.replace(/usePathname\(\)/g, 'useLocation().pathname');
      // replace useRouter() with useNavigate()
      content = content.replace(/useRouter\(\)/g, 'useNavigate()');
      // replace router.push with navigate
      content = content.replace(/router\.push/g, 'navigate');
    }
    
    // Save to target
    await fs.writeFile(targetFile, content);
    console.log(`Converted ${relPath} to ${targetFile}`);
  }
}

async function run() {
  await copyFolders();
  await convertPages();
}

run().catch(console.error);

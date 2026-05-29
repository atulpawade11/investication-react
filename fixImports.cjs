const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

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

  // Remove 'use client'
  content = content.replace(/["']use client["'];?\s*/g, '');
  
  // Convert next/link
  content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"]/g, 'import { Link } from "react-router-dom"');
  
  // Convert next/image
  content = content.replace(/import\s+Image\s+from\s+['"]next\/image['"]/g, '');
  content = content.replace(/<Image([^>]+)\/?>/g, (match, props) => {
     let newProps = props.replace(/priority=\{?[^}]*\}?/g, '')
                         .replace(/fill(=\{[^}]*\})?/g, '')
                         .replace(/objectFit=["'][^"']*["']/g, '')
                         .replace(/layout=["'][^"']*["']/g, '');
     return `<img${newProps}/>`;
  });
  
  // Change next/navigation
  if (content.includes('next/navigation')) {
    content = content.replace(/import\s+{[^}]*}\s+from\s+['"]next\/navigation['"]/g, 'import { useParams, useNavigate, useLocation } from "react-router-dom"');
    content = content.replace(/usePathname\(\)/g, 'useLocation().pathname');
    content = content.replace(/useRouter\(\)/g, 'useNavigate()');
    content = content.replace(/router\.push/g, 'navigate');
  }

  // Next.js specific dynamic imports if any
  // next/dynamic
  content = content.replace(/import\s+dynamic\s+from\s+['"]next\/dynamic['"]/g, 'import { lazy, Suspense } from "react"');
  
  if (content !== original) {
    await fs.promises.writeFile(file, content);
    console.log(`Updated ${file}`);
  }
}

walk(srcDir).catch(console.error);

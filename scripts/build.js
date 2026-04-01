#!/usr/bin/env node

/**
 * LJT Paysage - Build & Optimization Script
 * Nouvelle structure: src/ → dist/ pour déploiement
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(color, message) {
    console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(colors.green, `[OK] ${message}`);
}

function logWarning(message) {
    log(colors.yellow, `[WARN] ${message}`);
}

function logError(message) {
    log(colors.red, `[ERROR] ${message}`);
}

function logInfo(message) {
    log(colors.cyan, `ℹ ${message}`);
}

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

/**
 * Build process: src/ + assets/ + public/ → dist/
 */
function buildSite() {
    logInfo('Building LJT Paysage website...');
    
    const rootDir = path.join(__dirname, '..');
    const distDir = path.join(rootDir, 'dist');
    
    // Clean dist directory
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true });
    }
    fs.mkdirSync(distDir, { recursive: true });

    // Copy source files (src/)
    const srcFiles = ['index.html', 'styles.css', 'script.js'];
    srcFiles.forEach(file => {
        const sourcePath = path.join(rootDir, 'src', file);
        const destPath = path.join(distDir, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            logSuccess(`src/${file} → dist/${file}`);
        }
    });

    // Copy public files
    const publicFiles = ['manifest.json', 'robots.txt', 'sitemap.xml', '.htaccess', 'sw.js'];
    publicFiles.forEach(file => {
        const sourcePath = path.join(rootDir, 'public', file);
        const destPath = path.join(distDir, file);
        
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            logSuccess(`public/${file} → dist/${file}`);
        }
    });

    // Copy assets directory (images, etc.)
    const assetsSource = path.join(rootDir, 'assets');
    const assetsDest = path.join(distDir, 'assets');
    
    if (fs.existsSync(assetsSource)) {
        copyDirectory(assetsSource, assetsDest);
        logSuccess('assets/ → dist/assets/');
    }

    logSuccess('Build completed! Ready for deployment.');
    logInfo('Deploy folder: dist/');
}

/**
 * Verify SEO essentials
 */
function verifySEO() {
    logInfo('Verifying SEO essentials...');
    
    const rootDir = path.join(__dirname, '..');
    const indexPath = path.join(rootDir, 'src', 'index.html');
    
    if (!fs.existsSync(indexPath)) {
        logError('index.html not found in src/');
        return false;
    }
    
    const content = fs.readFileSync(indexPath, 'utf-8');

    const checks = {
        'Meta description': /<meta name="description"/.test(content),
        'Meta keywords': /<meta name="keywords"/.test(content), 
        'Open Graph title': /<meta property="og:title"/.test(content),
        'Canonical URL': /<link rel="canonical"/.test(content),
        'H1 title': /<h1/.test(content),
        'Structured Data': /<script type="application\/ld\+json"/.test(content),
        'Mobile viewport': /<meta name="viewport"/.test(content),
        'Sitemap reference': /sitemap\.xml/.test(content)
    };

    console.log('\n' + colors.cyan + 'SEO Verification:' + colors.reset);
    
    let passed = 0;
    Object.entries(checks).forEach(([check, result]) => {
        if (result) {
            logSuccess(check);
            passed++;
        } else {
            logError(check);
        }
    });

    console.log(`\n${passed}/${Object.keys(checks).length} SEO checks passed\n`);
    return passed === Object.keys(checks).length;
}

/**
 * Analyze project structure
 */
function analyzeStructure() {
    logInfo('Analyzing project structure...');
    
    const rootDir = path.join(__dirname, '..');
    
    const structure = {
        'src/': fs.existsSync(path.join(rootDir, 'src')),
        'assets/images/': fs.existsSync(path.join(rootDir, 'assets', 'images')),
        'public/': fs.existsSync(path.join(rootDir, 'public')),
        'scripts/': fs.existsSync(path.join(rootDir, 'scripts')),
        'README.md': fs.existsSync(path.join(rootDir, 'README.md'))
    };

    console.log('\n' + colors.cyan + 'Project Structure:' + colors.reset);
    
    Object.entries(structure).forEach(([dir, exists]) => {
        if (exists) {
            logSuccess(dir);
        } else {
            logWarning(`Missing: ${dir}`);
        }
    });

    // Count images
    const imagesDir = path.join(rootDir, 'assets', 'images');
    if (fs.existsSync(imagesDir)) {
        const imageCount = countImages(imagesDir);
        console.log(`\nImages found: ${imageCount} files`);
    }
}

/**
 * Count images recursively
 */
function countImages(dir) {
    let count = 0;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            count += countImages(filePath);
        } else if (/\.(jpg|jpeg|png|svg|gif|webp)$/i.test(file)) {
            count++;
        }
    });
    
    return count;
}

/**
 * Main build process
 */
function build() {
    console.log('\n' + colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset);
    console.log(colors.blue + '  LJT PAYSAGE - BUILD & DEPLOYMENT' + colors.reset);
    console.log(colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');

    try {
        // 1. Analyze structure
        analyzeStructure();

        // 2. Build site
        buildSite();

        // 3. Verify SEO
        const seoPassed = verifySEO();

        // Final status
        console.log(colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset);
        if (seoPassed) {
            logSuccess('Build successful - Ready for deployment!');
            log(colors.cyan, '\nNext steps:');
            console.log('  1. git add . && git commit -m "Update"');
            console.log('  2. git push origin main');
            console.log('  3. Auto-deploy to Vercel');
            console.log('  4. Upload images to assets/images/');
        } else {
            logWarning('Build completed with warnings. Check SEO issues above.');
        }
        console.log(colors.blue + '═══════════════════════════════════════════════════════════' + colors.reset + '\n');

    } catch (error) {
        logError(`Build failed: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

// Run build if executed directly
if (require.main === module) {
    build();
}

module.exports = {
    buildSite,
    verifySEO,
    analyzeStructure,
    copyDirectory
};
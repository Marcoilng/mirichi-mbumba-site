import { cpSync, mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = process.cwd();
const legacyHtml = join(root, 'legacy-html');

// 1. Copy static assets
const target = join(legacyHtml, 'images');
mkdirSync(target, { recursive: true });
cpSync(join(root, 'images'), target, { recursive: true, force: true });
cpSync(join(root, 'public', 'favicon.svg'), join(legacyHtml, 'favicon.svg'), { force: true });
console.log('Deploy assets copied to legacy-html/');

// 2. Inject Supabase credentials as <meta> tags into all HTML files
//    Credentials come from Vercel environment variables — NEVER hardcoded.
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[SECURITY] WARNING: SUPABASE_URL or SUPABASE_ANON_KEY env vars not set. Site will run in local-storage mode.');
} else {
    console.log('[Security] Injecting Supabase credentials via meta tags (env vars)...');
}

// Meta tags to inject (right after <head>)
const metaInject = supabaseUrl && supabaseAnonKey
    ? `\n    <meta name="supabase-url" content="${supabaseUrl.replace(/"/g, '&quot;')}">\n    <meta name="supabase-anon-key" content="${supabaseAnonKey.replace(/"/g, '&quot;')}">`
    : '';

function injectMetaIntoHtml(htmlContent) {
    if (!metaInject) return htmlContent;
    // Insert after <head> tag
    return htmlContent.replace(/(<head[^>]*>)/i, `$1${metaInject}`);
}

// Process all .html files in legacy-html/
function processDir(dir) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const st = statSync(fullPath);
        if (st.isDirectory()) {
            processDir(fullPath);
        } else if (extname(entry).toLowerCase() === '.html') {
            let content = readFileSync(fullPath, 'utf8');
            const updated = injectMetaIntoHtml(content);
            if (updated !== content) {
                writeFileSync(fullPath, updated, 'utf8');
                console.log(`  Injected meta tags into: ${entry}`);
            }
        }
    }
}

processDir(legacyHtml);
console.log('Deploy preparation complete.');

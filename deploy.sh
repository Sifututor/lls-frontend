#!/bin/bash

# ============================================
# LEARNEST REACT APP — CPANEL DEPLOYMENT SCRIPT
# ============================================

echo "🚀 Starting deployment process..."

# Exit on any error
set -e

# ============================================
# CONFIGURATION — UPDATE THESE VALUES
# ============================================
FTP_HOST="ftp.tutorla.tech"
FTP_USER="lmssifututorla@learnest-frontend.tutorla.tech"
FTP_PASS="Admin@2026++"
REMOTE_DIR="/home/lmssifututorla/learnest-frontend.tutorla.tech/"
# For subdomain: REMOTE_DIR="/public_html/subdomain_folder"
# For addon domain: Check document root in cPanel

# ============================================
# STEP 1: Install dependencies
# ============================================
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# ============================================
# STEP 2: Build for production
# ============================================
echo "🔨 Building for production..."
npm run build

# ============================================
# STEP 3: Create .htaccess if not exists
# ============================================
echo "📝 Creating .htaccess file..."
cat > build/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Enable Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
EOF

echo "✅ .htaccess created"

# ============================================
# STEP 4: Deploy via FTP
# ============================================
echo "📤 Uploading to cPanel via FTP..."

# Using lftp for FTP upload (more reliable than ftp command)
lftp -c "
set ftp:ssl-allow no;
set ssl:verify-certificate no;
open -u $FTP_USER,$FTP_PASS $FTP_HOST;
mirror -R --delete --verbose build/ $REMOTE_DIR;
quit
"

echo ""
echo "============================================"
echo "✅ DEPLOYMENT COMPLETE!"
echo "============================================"
echo "🌐 Your app is live at: https://yourdomain.com"
echo ""

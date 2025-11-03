# Production Deployment Guide

## Problem Summary
The production errors occurred because:
1. ❌ Vite build files were not being served by Express server
2. ❌ Server returned HTML (404 pages) instead of JavaScript files
3. ❌ Browser tried to parse HTML as JavaScript → "Unexpected token '<'" errors

## Solution Implemented

### 1. **Updated `server.js`**
- Added static file serving for Vite build directory (`dist`)
- Added catch-all route to handle React Router
- Changed PORT to use environment variable

### 2. **Updated `vite.config.js`**
- Set proper base path
- Configured build options
- Ensured assets are organized correctly

## Deployment Steps

### **Step 1: Build the React App**
```bash
npm run build
```
This creates a `dist` folder with all your production-ready files.

### **Step 2: Test Locally**
```bash
npm start
```
Visit `http://localhost:5000` to verify everything works.

### **Step 3: Deploy to Production**

#### Option A: VPS/Server Deployment
```bash
# On your server
git pull origin frontend
npm install
npm run build
npm start
```

#### Option B: Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start server.js --name "owatmaid-hrm"
pm2 save
pm2 startup
```

### **Step 4: Nginx Configuration (if using)**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Important Notes

### ⚠️ Common Mistakes to Avoid:
1. **Don't forget to build**: Always run `npm run build` before deploying
2. **Check .gitignore**: Make sure `dist` folder is NOT in `.gitignore` for production, OR build on server
3. **Environment variables**: Set proper MySQL credentials for production
4. **Port conflicts**: Ensure port 5000 is available

### 📁 File Structure After Build:
```
fdOwat/
├── dist/                  # Built React app (created by npm run build)
│   ├── index.html
│   ├── assets/
│   │   ├── js/
│   │   └── css/
├── server.js              # Express server (serves dist folder)
├── package.json
└── vite.config.js
```

## Troubleshooting

### If you still see "Unexpected token '<'" errors:

1. **Clear browser cache**: Hard refresh with `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)

2. **Verify build folder**: Check that `dist` folder exists and contains files

3. **Check server logs**: Look for any errors when accessing assets

4. **Verify paths**: Open browser DevTools → Network tab → Check if files are 404

5. **Test asset URLs directly**: Try accessing `http://yourdomain.com/assets/js/jquery.min.js`

### If jQuery is still not defined:

Check your `index.html` in the built `dist` folder. Vite may be bundling these scripts differently. You might need to:

1. Install jQuery as an npm package:
```bash
npm install jquery
```

2. Import it in your React components where needed:
```javascript
import $ from 'jquery';
```

Or move the jQuery scripts to the `public` folder instead of `assets`.

## Alternative: Public Folder Approach

If you want to keep using the old PHP-style asset loading:

1. Create a `public` folder in project root
2. Move `assets` folder to `public/assets`
3. Vite will automatically copy `public` contents to `dist` during build
4. Update `index.html` paths to `/assets/...` (no change needed)

## Production Checklist

- [ ] Run `npm run build`
- [ ] Test with `npm start` locally
- [ ] Verify all assets load correctly
- [ ] Check browser console for errors
- [ ] Test all application routes
- [ ] Verify database connection
- [ ] Set production environment variables
- [ ] Configure proper CORS settings
- [ ] Set up SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring/logging

## Support

If issues persist after following this guide:
1. Check server logs: `pm2 logs` (if using PM2)
2. Check browser console: F12 → Console tab
3. Check network requests: F12 → Network tab
4. Verify file permissions on server

---
Last Updated: November 3, 2025

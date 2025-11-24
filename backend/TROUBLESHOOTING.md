# Backend Troubleshooting Guide

## Common "App Crashed" Issues and Solutions

### Issue 1: MongoDB Connection Failed

**Error Message:**
```
Error connecting to MongoDB
MongooseServerSelectionError
```

**Solutions:**

1. **Check your `.env` file:**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-tracker?retryWrites=true&w=majority
   ```

2. **Verify MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Check if cluster is running (not paused)
   - Verify Network Access allows your IP (0.0.0.0/0 for development)
   - Check Database Access - user exists and has correct permissions

3. **Test connection string:**
   - Copy your connection string from Atlas
   - Make sure username and password are correct
   - URL encode special characters in password (@ → %40, # → %23, etc.)

4. **Check connection string format:**
   - Should start with `mongodb+srv://`
   - Should include database name: `...mongodb.net/budget-tracker?...`
   - No spaces in the string

### Issue 2: Missing Dependencies

**Error Message:**
```
Cannot find module 'express'
Cannot find module 'mongoose'
```

**Solution:**
```powershell
cd backend
npm install
```

### Issue 3: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::8000
```

**Solutions:**

1. **Find and kill the process:**
   ```powershell
   # Find process using port 8000
   netstat -ano | findstr :8000
   
   # Kill the process (replace PID with actual process ID)
   taskkill /PID <PID> /F
   ```

2. **Or change the port in `.env`:**
   ```env
   PORT=8001
   ```

### Issue 4: Missing .env File or Variables

**Error Message:**
```
MONGO_URI is not defined
```

**Solution:**

1. Create `.env` file in `backend` folder:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/budget-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here_min_32_characters
   PORT=8000
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

2. Make sure `.env` is in the `backend` folder (same level as `server.js`)

### Issue 5: Node.js Version Issues

**Error Message:**
```
Syntax errors
Module not found
```

**Solution:**

1. **Check Node.js version:**
   ```powershell
   node --version
   ```
   Should be v18.x or v20.x (LTS versions)

2. **If using Node v25 or newer:**
   - Downgrade to Node v20 LTS
   - Download from: https://nodejs.org/

### Issue 6: Invalid JWT Secret

**Error Message:**
```
JWT_SECRET is required
```

**Solution:**

Add to `.env`:
```env
JWT_SECRET=your_super_secret_key_at_least_32_characters_long_123456789
```

---

## Step-by-Step Debugging

### Step 1: Check Error Message

Look at the terminal output. The error message will tell you what's wrong:

- **"Error connecting to MongoDB"** → MongoDB connection issue
- **"Cannot find module"** → Missing dependencies
- **"EADDRINUSE"** → Port conflict
- **"MONGO_URI is not defined"** → Missing .env variable

### Step 2: Verify .env File

1. Open `backend/.env`
2. Check all required variables are present:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`
   - `CLIENT_URL`

3. Make sure there are no:
   - Extra spaces
   - Quotes around values (unless needed)
   - Missing values

### Step 3: Test MongoDB Connection

1. **Get your connection string from MongoDB Atlas**
2. **Test it in MongoDB Compass** (download from mongodb.com)
3. If Compass can't connect, the connection string is wrong

### Step 4: Reinstall Dependencies

```powershell
cd backend
rm -r node_modules
rm package-lock.json
npm install
```

### Step 5: Check File Structure

Make sure your `backend` folder has:
```
backend/
├── .env
├── server.js
├── package.json
├── config/
│   └── db.js
├── routes/
│   ├── authRoutes.js
│   ├── incomeRoutes.js
│   ├── expenseRoutes.js
│   └── dashboardRoutes.js
├── controllers/
├── models/
└── middleware/
```

---

## Quick Fix Commands

### Complete Reset:

```powershell
# Navigate to backend
cd "Budget Tracker\backend"

# Remove node_modules
Remove-Item -Recurse -Force node_modules

# Remove package-lock.json
Remove-Item -Force package-lock.json

# Reinstall dependencies
npm install

# Start server
npm run dev
```

### Check MongoDB Connection:

```powershell
# In backend folder, create test file: test-db.js
# Add this code:
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

# Run it
node test-db.js
```

---

## Example Working .env File

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://budgettracker_user:MyPassword123@cluster0.abc123.mongodb.net/budget-tracker?retryWrites=true&w=majority

# JWT Secret (minimum 32 characters)
JWT_SECRET=25b20ccc6bbafa9699b805fb66bc42e6efbf82663fb8969751f7a837dc47d72bb17b7623f3371c9778d93e0739a039fd42c4e22f941ac33eaf806b38302ffc17

# Server Port
PORT=8000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

---

## Still Not Working?

1. **Share the exact error message** from your terminal
2. **Check MongoDB Atlas:**
   - Is cluster running?
   - Is IP whitelisted?
   - Is database user created?
3. **Verify Node.js version:** `node --version`
4. **Check if port is free:** `netstat -ano | findstr :8000`



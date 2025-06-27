# MongoDB Atlas Setup - Detailed Step-by-Step Guide

## Total Time: 5 minutes

### Step 1: Create Account (1 minute)

1. **Open your browser** and go to: https://www.mongodb.com/cloud/atlas
2. **Click the green button** "Try Free" or "Get started free"
3. **Sign up** using:
   - Google account (fastest) OR
   - Email address
4. **Fill required fields** (if using email):
   - First name
   - Last name
   - Email
   - Password
   - Company: "Personal"
   - Job title: "Developer"

### Step 2: Create Your Cluster (2 minutes)

After signing in, you'll see the cluster creation page:

1. **Choose Plan**: 
   - Select "M0" (FREE Forever - 512MB)
   - Click "Create"

2. **Provider & Region**:
   - Provider: AWS (default)
   - Region: Pick closest to you
     - US East: `us-east-1` (Virginia)
     - US West: `us-west-2` (Oregon)
     - Europe: `eu-west-1` (Ireland)
   
3. **Cluster Name**: 
   - Leave as "Cluster0" (default) or
   - Name it "WealthWiseCluster"

4. **Click "Create Cluster"**
   - Wait 1-3 minutes for creation

### Step 3: Create Database User (1 minute)

While cluster is creating:

1. **Left sidebar** → Click "Database Access"
2. **Click** "Add New Database User" (green button)
3. **Fill in**:
   ```
   Username: wealthwise-admin
   Password: [Click "Autogenerate Secure Password"]
   ```
4. **IMPORTANT**: Copy the password to notepad!
   ```
   Example: xK9mP2nQ5rT8vB3w
   ```
5. **User Privileges**: Select "Atlas Admin"
6. **Click** "Add User"

### Step 4: Allow Network Access (30 seconds)

1. **Left sidebar** → Click "Network Access"
2. **Click** "Add IP Address"
3. **Click** "Allow Access from Anywhere"
4. **Verify** it shows: `0.0.0.0/0`
5. **Click** "Confirm"

### Step 5: Get Your Connection String (30 seconds)

1. **Left sidebar** → Click "Database"
2. **Your cluster** should show "Ready"
3. **Click** "Connect" button
4. **Choose** "Connect your application"
5. **Settings**:
   - Driver: Node.js
   - Version: 5.5 or later
6. **Copy** the connection string

### Step 6: Prepare Your Final Connection String

The string looks like:
```
mongodb+srv://wealthwise-admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
```

**Make these changes**:

1. Replace `<password>` with your saved password
2. Add `wealthwise` before the `?`

**Your final string**:
```
mongodb+srv://wealthwise-admin:xK9mP2nQ5rT8vB3w@cluster0.abcde.mongodb.net/wealthwise?retryWrites=true&w=majority
```

## ✅ You're Done!

Save this connection string - you'll need it for Heroku in the next step.

## 🔍 Quick Verification

1. In MongoDB Atlas dashboard, you should see:
   - ✅ Cluster0 (or WealthWiseCluster) - Active
   - ✅ Database Access - 1 user
   - ✅ Network Access - 0.0.0.0/0

## 🚨 Common Issues

**"Connection failed" later?**
- Check Network Access is 0.0.0.0/0
- Verify password has no special characters that need escaping

**"Authentication failed"?**
- Double-check username/password
- Ensure no spaces in connection string

## 📝 What You Need for Next Step

Just one thing:
```
mongodb+srv://wealthwise-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wealthwise?retryWrites=true&w=majority
```

Ready to deploy! 🚀
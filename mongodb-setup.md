# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free" or "Get started free"
3. Sign up with Google or create an account

## 2. Create Your First Cluster

1. Choose "Shared" (FREE tier)
2. Cloud Provider: AWS
3. Region: Choose closest to you (e.g., us-east-1)
4. Cluster Name: "WealthWiseCluster" (or leave default)
5. Click "Create Cluster" (takes 1-3 minutes)

## 3. Database Access (Create User)

1. Left sidebar → "Database Access"
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `wealthwise-admin`
5. Password: Click "Autogenerate Secure Password"
6. **COPY AND SAVE THIS PASSWORD!**
7. Database User Privileges: "Atlas Admin"
8. Click "Add User"

## 4. Network Access (IMPORTANT!)

1. Left sidebar → "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Confirm: 0.0.0.0/0 (includes your current IP address)
5. Click "Confirm"

## 5. Get Connection String

1. Go back to "Database" in sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://wealthwise-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 6. Prepare Your Connection String

Replace:
- `<password>` with the password you saved
- Add database name before the `?`:
  ```
  mongodb+srv://wealthwise-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wealthwise?retryWrites=true&w=majority
  ```

## Your MongoDB URI is ready! Save this:
```
mongodb+srv://wealthwise-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/wealthwise?retryWrites=true&w=majority
```
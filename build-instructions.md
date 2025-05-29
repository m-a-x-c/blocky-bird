# Microsoft Store Publishing Instructions

## Prerequisites

Before building the MSIX package, you need to:

1. **Install electron-builder**:
   ```powershell
   npm install
   ```

2. **Update Publisher Information**:
   Edit `package.json` and replace the following placeholders:
   - `"Your Name"` → Your actual name
   - `"Your Publisher Name"` → Your publisher name
   - `"YourPublisherName.FlappyBird"` → Your unique app identifier
   - `"CN=Your Publisher Name"` → Your certificate subject name

3. **Icon Requirements**:
   - The current icon (32x32) works but Microsoft Store prefers larger icons
   - Recommended: Create icons in sizes 16x16, 32x32, 48x48, 256x256
   - Place them in the `assets/` folder or use a single high-resolution PNG

## Building the MSIX Package

### Step 1: Install Dependencies
```powershell
npm install
```

### Step 2: Build the MSIX
```powershell
npm run build:msix
```

This will create:
- `dist/Flappy Bird 1.0.0.msix` - The package for Microsoft Store
- `dist/Flappy Bird Setup 1.0.0.exe` - Traditional installer

## Microsoft Store Submission

### Step 1: Create a Microsoft Partner Center Account
1. Go to [Microsoft Partner Center](https://partner.microsoft.com/)
2. Register as an app developer
3. Pay the one-time registration fee ($19 for individuals, $99 for companies)

### Step 2: Reserve Your App Name
1. In Partner Center, go to "Apps and games"
2. Click "New product" → "MSIX or PWA app"
3. Reserve the name "Flappy Bird" (or choose a unique variation)

### Step 3: Upload Your MSIX
1. In your app's dashboard, go to "Packages"
2. Upload the `.msix` file from the `dist/` folder
3. Fill out the required store listing information:
   - Description
   - Screenshots (use the ones in `assets/`)
   - Age rating
   - Privacy policy (if applicable)

### Step 4: Certification
- Microsoft will review your app (usually takes 1-7 days)
- They'll check for compliance with store policies
- Once approved, your app will be available in the Microsoft Store

## Important Notes

### Certificate Signing
- For Microsoft Store submission, you don't need to sign the MSIX yourself
- Microsoft will sign it during the certification process
- For testing locally, you may need to enable "Developer mode" in Windows

### App Identity
- The `identityName` in package.json must match what you reserve in Partner Center
- The `publisher` must match your Partner Center publisher ID
- These can be updated after reserving your app name

### Testing Your MSIX
Before submitting, test your MSIX locally:

1. Enable Developer Mode in Windows Settings
2. Right-click the `.msix` file and select "Install"
3. Test all game functionality
4. Verify the app appears correctly in Start Menu

## Troubleshooting

### Common Issues:
1. **Icon not showing**: Ensure `assets/icon.png` exists and is at least 256x256
2. **Build fails**: Check that all file paths in package.json are correct
3. **MSIX won't install**: Enable Developer Mode in Windows Settings
4. **Store rejection**: Review Microsoft Store policies and ensure compliance

### Build Errors:
If you get build errors, try:
```powershell
# Clear cache and rebuild
npm run build:msix -- --clean
```

## Next Steps After Publishing

1. Monitor app performance in Partner Center analytics
2. Respond to user reviews
3. Update the app by uploading new MSIX packages
4. Consider adding features based on user feedback

Good luck with your Microsoft Store submission! 🚀

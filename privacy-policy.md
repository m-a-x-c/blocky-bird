# Privacy Policy for Flappy Bird

**Last Updated:** December 29, 2024

## Overview

This privacy policy explains how Flappy Bird ("the App") handles user information and data. We are committed to protecting your privacy and being transparent about our data practices.

## Data Collection and Usage

**We do not collect, store, transmit, or share any personal information or user data.**

### What We Don't Collect:
- Personal information (name, email, phone number, etc.)
- Device identifiers or hardware information
- Location data
- Usage analytics or telemetry
- Network activity or browsing history
- Files or documents from your device
- Any form of user-generated content

### Local Data Storage

The App stores only the following data locally on your device:
- **High Scores**: Your best scores for each difficulty level are saved in a local file (`scores.json`) on your device
- **Game Settings**: Sound preferences (mute/unmute status)

This data:
- Remains entirely on your device
- Is never transmitted to external servers
- Is not accessible to us or any third parties
- Can be deleted by uninstalling the App

## Electron Runtime and runFullTrust Capability

### Why runFullTrust is Required

Flappy Bird is built using Electron, a framework that allows web technologies to create desktop applications. The Microsoft Store requires apps using Electron to declare the `runFullTrust` capability because:

1. **Electron Runtime**: The app runs on the Electron framework, which provides a runtime environment
2. **Local File Access**: The app needs to read and write the high scores file locally
3. **Audio Playback**: The app plays sound effects using web audio APIs
4. **Canvas Rendering**: The game uses HTML5 Canvas for graphics rendering

### What runFullTrust Does NOT Mean for This App

Despite having the `runFullTrust` capability, our app:
- **Does not access the internet** - No network connections are made
- **Does not access system files** - Only reads/writes its own game data
- **Does not monitor system activity** - No tracking or surveillance
- **Does not access other applications** - Completely isolated to its own functionality
- **Does not collect telemetry** - No usage data is gathered or transmitted

## Technical Implementation

### Data Isolation
- All game data is stored in the app's designated local storage area
- No cross-application data access
- No system registry modifications
- No installation of additional software or drivers

### Network Activity
- **Zero network connections** - The app operates entirely offline
- No data transmission to external servers
- No automatic updates or telemetry reporting
- No third-party service integrations

### Security Measures
- Local data is stored in standard JSON format (human-readable)
- No encryption needed as no sensitive data is collected
- No user authentication or account systems
- No data synchronization across devices

## Third-Party Services

**We do not use any third-party services, analytics, advertising networks, or external APIs.**

The app is completely self-contained and operates independently without any external dependencies or connections.

## Children's Privacy

This app is suitable for all ages and does not collect any information from users of any age, including children under 13. Since no data collection occurs, there are no special considerations needed for younger users.

## Data Retention and Deletion

### Local Data
- High scores and settings remain on your device until you uninstall the app
- You can reset high scores by deleting the `scores.json` file in the app's data folder
- Complete data removal occurs automatically when the app is uninstalled

### No Remote Data
- Since we don't collect any data remotely, there is no data to delete from our systems
- We maintain no databases, servers, or cloud storage related to user data

## Your Rights and Control

You have complete control over your data because:
- All data remains on your device
- You can delete the app and all associated data at any time
- No account creation or registration is required
- No data is shared with us or third parties

## Changes to This Privacy Policy

If we make changes to this privacy policy, we will:
- Update the "Last Updated" date at the top of this document
- Include the updated policy with app updates
- Maintain our commitment to not collecting user data

## Contact Information

If you have questions about this privacy policy or the app's data practices:

- **App Name**: Blocky Bird
- **Developer**: Numeron

## Compliance

This privacy policy is designed to comply with:
- Microsoft Store privacy requirements
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Children's Online Privacy Protection Act (COPPA)

## Summary

**Flappy Bird is a simple, offline game that collects no personal information and transmits no data. The runFullTrust capability is required only for the Electron runtime environment and does not enable any data collection or privacy-invasive features.**

Your privacy is fully protected because we simply don't collect, access, or transmit any of your information.

# Vibetest - Ionic Angular PWA Project

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

Bootstrap, build, and test the repository:
- Navigate to ionic-app directory: `cd ionic-app`
- Install dependencies: `npm install` -- takes 35 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
- Install Ionic CLI globally: `npm install -g @ionic/cli` -- takes 12 seconds.
- Build for development: `npm run build` -- takes 25 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
- Build for GitHub Pages: `npm run build -- --configuration=production-gh-pages` -- takes 25 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
- Run development server: `npm start` -- takes 40 seconds to start. NEVER CANCEL. Set timeout to 60+ minutes.
- Alternative development server: `ionic serve` -- runs on port 8100 instead of 4200.
- Sync mobile platforms: `npx cap sync` -- takes 1 second. Works but warns about missing CocoaPods/Xcode (expected in Linux environments).

## Validation

- ALWAYS manually validate the development server by running `npm start` and verifying it serves on http://localhost:4200 with HTTP 200 response.
- ALWAYS run through at least one complete end-to-end build scenario after making changes: `npm run build && npx cap sync`.
- The application builds successfully with PWA features including Service Worker (ngsw-worker.js).
- Lint command does NOT work: `npm run lint` fails with "Cannot find lint target" - ESLint is not configured.
- Test command does NOT work: `npm run test` fails with "Cannot determine project or target" - tests are not configured.
- You can build and run the web application successfully, and access it via browser on the development server.

## Common Tasks

### Repository Structure
```
/
├── .github/workflows/     # CI/CD workflows for mobile builds and PWA deployment
├── ionic-app/            # Main Ionic Angular application
│   ├── src/              # Source code
│   ├── www/              # Build output directory
│   ├── android/          # Android Capacitor project
│   ├── ios/              # iOS Capacitor project
│   ├── package.json      # Node.js dependencies and scripts
│   └── angular.json      # Angular CLI configuration
└── README.md             # Project documentation
```

### Key Files and Directories
- **ionic-app/src/app/home/**: Main home page component
- **ionic-app/src/manifest.json**: PWA manifest for "Ionic Vibe Test App"
- **ionic-app/ngsw-config.json**: Service Worker configuration
- **ionic-app/capacitor.config.json**: Capacitor mobile platform configuration
- **ionic-app/ionic.config.json**: Ionic CLI configuration

### Build Configurations
1. **Development**: `npm run build` (default configuration)
2. **Production**: `npm run build -- --configuration=production`
3. **GitHub Pages**: `npm run build -- --configuration=production-gh-pages` (sets baseHref to "/vibetest/")

### PWA Features
The application is configured as a Progressive Web App with:
- Service Worker for offline functionality and caching
- Web App Manifest for home screen installation
- Multiple icon sizes (72x72 to 512x512)
- API caching strategy for GitHub API calls

### Development Servers
- **Angular Dev Server**: `npm start` → http://localhost:4200
- **Ionic Dev Server**: `ionic serve` → http://localhost:8100
- Both take ~40 seconds to compile and start. NEVER CANCEL - wait for "✔ Compiled successfully" message.

### Mobile Development
- **Capacitor Version**: 7.4.2
- **Platforms**: Android and iOS configured
- **Sync Command**: `npx cap sync` (copies web assets to mobile platforms)
- **Platform Builds**: Use GitHub Actions workflows in `.github/workflows/`

### CI/CD Workflows
1. **deploy.yml**: Builds and deploys PWA to GitHub Pages on main branch push
2. **mobile-build.yml**: Builds Android APK and iOS archive for main/develop branches
3. **android-build.yml**: Detailed Android builds with APK and AAB
4. **ios-build.yml**: Detailed iOS builds with IPA generation

### Deployed Application
Live PWA available at: https://deno78.github.io/vibetest/

### Environment Requirements
- **Node.js**: 20+ (tested with 20.x)
- **npm**: Latest version
- **Ionic CLI**: 7.2.1 (install globally with `npm install -g @ionic/cli`)
- **Capacitor CLI**: 7.4.2 (included in dependencies)

### Troubleshooting
- Bundle size warning: "bundle initial exceeded maximum budget" is expected (621KB vs 500KB limit)
- CSS warnings: 20 Ionic CSS rules skip due to selector errors (this is normal)
- Lint errors: ESLint not configured - do not attempt to fix lint issues
- Test errors: Unit testing not configured - do not attempt to run tests
- CocoaPods warnings: Expected in non-macOS environments when running `npx cap sync`

### Development Workflow
1. Make changes in `ionic-app/src/`
2. Test with development server: `npm start`
3. Build for production: `npm run build`
4. Sync mobile platforms: `npx cap sync`
5. Commit changes (CI/CD will automatically build and deploy)

### Important Notes
- NEVER CANCEL builds or long-running commands - builds may take up to 60 minutes in slower environments
- Always work in the `ionic-app/` directory for development tasks
- The application uses Angular 17 with Ionic 8
- Service Worker is enabled in production builds for PWA functionality
- GitHub Pages deployment uses a special configuration with baseHref="/vibetest/"
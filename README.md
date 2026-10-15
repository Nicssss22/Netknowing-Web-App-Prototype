# Netknowing Web App Prototype

A React and Vite front-end prototype for the Netknowing network monitoring system. The app uses sample data; it does not connect to real campus devices or send email alerts.

## Requirements

- Node.js with Corepack available
- Windows PowerShell

## Run locally

Open PowerShell in the project folder and install the dependencies:

```powershell
cd "C:\Users\agsti\Downloads\Netknowing Web App Prototype"
corepack pnpm install
```

Start the Vite development server:

```powershell
corepack pnpm dev
```

Open the local URL printed in the terminal (typically `http://localhost:5173/`). Keep the terminal open while using the app. Press `Ctrl+C` in the terminal to stop the server.

If Corepack is not enabled, run `corepack enable` from an elevated PowerShell window, then retry the commands above.

## Other commands

```powershell
corepack pnpm build
corepack pnpm preview
corepack pnpm format
```

- `build` creates a production build in `dist`.
- `preview` serves the production build locally after running `build`.
- `format` formats the project files with Oxfmt.

## Prototype notes

The screens and values are illustrative sample data. Device polling, email delivery, persistent user and audit records, real SSH or reboot actions, and AI model integration are not connected in this prototype.

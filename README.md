# Netknowing Web App Prototype 

A React and Vite front-end prototype for the Netknowing network monitoring system. The app uses sample data; it does not connect to real campus devices or send email alerts.

## Requirements

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+
- Corepack available in your terminal

The setup commands below work in PowerShell, Command Prompt, macOS, and Linux terminals.

## Run locally

Clone the repository, replacing `<repository-url>` with the repository's Git URL:

```sh
git clone https://github.com/Nicssss22/Netknowing-Web-App-Prototype.git
cd <repository-folder>
```

Run the following commands from the cloned project folder (the folder containing `package.json`) to install dependencies:

```sh
corepack pnpm install
```

Start the development server:

```sh
corepack pnpm dev
```

Open the local URL printed in the terminal (typically `http://localhost:5173/`). Keep the terminal open while using the app. Press `Ctrl+C` to stop the server.

If Corepack is not available, follow the [Corepack installation instructions](https://github.com/nodejs/corepack#installation) for your platform, then retry the commands above.

## Other commands

```sh
corepack pnpm build
corepack pnpm preview
corepack pnpm format
```

- `build` creates a production build in `dist`.
- `preview` serves the production build locally after running `build`.
- `format` formats the project files with Oxfmt.

## GitHub Pages deployment

This repository deploys GitHub Pages from the workflow in `.github/workflows/deploy-pages.yml`, which uploads the Vite `dist/` artifact.

One-time repository setting required:

- **Settings → Pages → Build and deployment → Source = GitHub Actions**

## Prototype notes

The screens and values are illustrative sample data. Device polling, email delivery, persistent user and audit records, real SSH or reboot actions, and AI model integration are not connected in this prototype.

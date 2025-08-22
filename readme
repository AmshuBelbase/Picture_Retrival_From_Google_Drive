A lightweight Node.js/Express service that indexes images from a specific Google Drive folder and exposes a simple HTTP API to search them by ID or filename. The service caches results in memory for fast responses and supports manual cache refresh.

### Features
- Google Drive integration (Drive API v3) with OAuth2

- Reads images from a single Drive folder (by folder ID)

- In-memory cache with startup warm and on-demand refresh

- Search by exact file ID or substring match on ID/name

- Simple REST API (JSON)

- CORS enabled and static file hosting (for a front-end, if needed)

### Project Structure
- server.js — Express app bootstrap, CORS, static hosting, API mounting, and cache warm-up

- routes.js — API routes: GET /api/search and POST /api/refresh

- driveImages.js — Google Drive auth, image listing, cache management, and search helpers

- public/ — Optional static assets served by Express (index.html, etc.)

- credentials.json — OAuth2 client credentials from Google Cloud (user-provided)

- token.json — OAuth2 tokens generated on first authorization (auto-created)

### Prerequisites
- Node.js 16+ and npm

- A Google Cloud project with Drive API enabled

- OAuth2 Desktop application credentials (JSON)

- Access to the target Google Drive folder and its images

### Google Cloud Setup
- Create a project at Google Cloud Console.

- Enable the “Google Drive API”.

- Create OAuth 2.0 client credentials:

- Application type: Desktop app.

- Download the JSON; save it to the project root as credentials.json.

- Ensure the Google account used for OAuth has at least Viewer access to the target Drive folder.

### Configuration
- Folder ID: Set in driveImages.js as FOLDER_ID.

- Replace the placeholder value with the actual Google Drive folder ID containing the images.

- Scopes: Uses Drive read-only scope: https://www.googleapis.com/auth/drive.readonly

- Token and credentials file locations:

- TOKEN_PATH: token.json (auto-created after first auth)

- CREDENTIALS_PATH: credentials.json (must exist before start)

### Installation
- Clone or copy the project files.

- Install dependencies:

- npm install

- Required packages: express, cors, googleapis

- Place credentials.json in the project root.

- If package.json is missing, create one and add dependencies: 
    -   npm init -y
    -   npm install express cors googleapis

### First Run & Authorization
- Start the server:
    -   npm start

    -   Or: node server.js

-   On first run, the app will print an authorization URL.

-   Open the URL in a browser, complete the Google consent flow, and copy the auth code.

-   Paste the code back into the terminal when prompted.

-   A token.json file will be saved for future runs.

-   If the initial cache warm-up fails, the app will still start and attempt to lazy-load on the first request.

## TIP

Do not run using localhost, after you start it, using ip based address e.g. 127.0.0.1 instead of localhost
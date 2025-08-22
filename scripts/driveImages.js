// driveImages.js
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
const TOKEN_PATH = 'token.json';
const CREDENTIALS_PATH = 'credentials.json';
const FOLDER_ID = '1d366Nyn5_m18ON52wAmaOOseLL40648rIafnBz0MtFj7b0EvEq9AEXEZlD1-IUCUUgT1yl4Z';

let filesCache = [];
let fileById = new Map();
let cacheReadyPromise = null;
let driveClient = null;

function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)));
  });
}

function writeFileAsync(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => (err ? reject(err) : resolve()));
  });
}

function rebuildIndex() {
  fileById = new Map(filesCache.map((f) => [f.id.toLowerCase(), f]));
}

function authorize(credentials) {
  return new Promise(async (resolve, reject) => {
    try {
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      try {
        const token = await readFileAsync(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        resolve(oAuth2Client);
      } catch {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', async (code) => {
          rl.close();
          try {
            const { tokens } = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);
            await writeFileAsync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('Token stored to', TOKEN_PATH);
            resolve(oAuth2Client);
          } catch (err) {
            reject(err);
          }
        });
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function fetchImagesOnce() {
  if (!driveClient) {
    const credsRaw = await readFileAsync(CREDENTIALS_PATH);
    const auth = await authorize(JSON.parse(credsRaw));
    driveClient = google.drive({ version: 'v3', auth });
  }

  let pageToken = null;
  const allFiles = [];

  do {
    const res = await driveClient.files.list({
      q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: 'nextPageToken, files(id, name, mimeType, webViewLink, webContentLink)',
      pageSize: 1000,
      pageToken,
    });
    const files = res.data.files || [];
    allFiles.push(...files);
    pageToken = res.data.nextPageToken || null;
  } while (pageToken);

  filesCache = allFiles;
  rebuildIndex();
  return filesCache;
}

function ensureCache() {
  if (!cacheReadyPromise) {
    cacheReadyPromise = fetchImagesOnce().catch((err) => {
      cacheReadyPromise = null;
      throw err;
    });
  }
  return cacheReadyPromise;
}

async function searchImage(query) {
  await ensureCache();
  const q = String(query || '').toLowerCase().trim();
  if (!q) return [];

  // Exact ID hit first
  const exact = fileById.get(q);
  if (exact) return [exact];

  // Fallback to substring match on id or name
  return filesCache.filter(
    (f) =>
      f.id.toLowerCase().includes(q) ||
      (f.name && f.name.toLowerCase().includes(q))
  );
}

async function refreshCache() {
  cacheReadyPromise = fetchImagesOnce().catch((err) => {
    cacheReadyPromise = null;
    throw err;
  });
  return cacheReadyPromise;
}

module.exports = {
  searchImage,
  refreshCache,
  ensureCache, // allow startup preload
};

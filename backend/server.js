const { createServer } = require("node:http");
const { readFile } = require("node:fs/promises");
const { extname, join, normalize } = require("node:path");
const { randomBytes, scryptSync, timingSafeEqual } = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const root = join(__dirname, "..");
const database = new DatabaseSync(join(__dirname, "data", "manager.db"));
database.exec(`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    manager_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
`);

const mimeTypes = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };
const json = (response, status, payload, headers = {}) => {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...headers });
  response.end(JSON.stringify(payload));
};
const readJson = async (request) => {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 20000) throw new Error("Payload too large");
  }
  return JSON.parse(body || "{}");
};
const hashPassword = (password, salt = randomBytes(16).toString("hex")) => `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const verifyPassword = (password, stored) => {
  const [salt, expectedHex] = stored.split(":");
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};
const getToken = (request) => request.headers.cookie?.split(";").map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith("session="))?.slice(8);
const getUser = (request) => {
  const token = getToken(request);
  if (!token) return null;
  return database.prepare("SELECT users.id, users.email, users.manager_name AS managerName FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token = ? AND sessions.expires_at > ?").get(token, Date.now()) || null;
};
const createSession = (userId) => {
  const token = randomBytes(32).toString("hex");
  database.prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)").run(token, userId, Date.now() + 1000 * 60 * 60 * 24 * 30);
  return token;
};

const server = createServer(async (request, response) => {
  try {
    if (request.url === "/api/register" && request.method === "POST") {
      const { email = "", password = "", managerName = "" } = await readJson(request);
      if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || managerName.trim().length < 2) return json(response, 400, { error: "Podaj poprawny e-mail, nazwę menedżera i hasło (min. 8 znaków)." });
      try {
        const result = database.prepare("INSERT INTO users (email, manager_name, password_hash) VALUES (?, ?, ?)").run(email.trim().toLowerCase(), managerName.trim(), hashPassword(password));
        const token = createSession(Number(result.lastInsertRowid));
        return json(response, 201, { user: { email: email.trim().toLowerCase(), managerName: managerName.trim() } }, { "Set-Cookie": `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000` });
      } catch (error) {
        if (error.code === "ERR_SQLITE_CONSTRAINT_UNIQUE") return json(response, 409, { error: "Konto z tym adresem już istnieje." });
        throw error;
      }
    }
    if (request.url === "/api/login" && request.method === "POST") {
      const { email = "", password = "" } = await readJson(request);
      const user = database.prepare("SELECT * FROM users WHERE email = ?").get(email.trim().toLowerCase());
      if (!user || !verifyPassword(password, user.password_hash)) return json(response, 401, { error: "Nieprawidłowy e-mail lub hasło." });
      const token = createSession(user.id);
      return json(response, 200, { user: { email: user.email, managerName: user.manager_name } }, { "Set-Cookie": `session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=2592000` });
    }
    if (request.url === "/api/session" && request.method === "GET") {
      const user = getUser(request);
      return user ? json(response, 200, { user }) : json(response, 401, { error: "Brak aktywnej sesji." });
    }
    if (request.url === "/api/logout" && request.method === "POST") {
      const token = getToken(request);
      if (token) database.prepare("DELETE FROM sessions WHERE token = ?").run(token);
      return json(response, 200, { ok: true }, { "Set-Cookie": "session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
    }
    if (request.url === "/api/account/password" && request.method === "PUT") {
      const user = getUser(request);
      if (!user) return json(response, 401, { error: "Musisz być zalogowany." });
      const { currentPassword = "", newPassword = "" } = await readJson(request);
      const account = database.prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id);
      if (!verifyPassword(currentPassword, account.password_hash)) return json(response, 400, { error: "Aktualne hasło jest nieprawidłowe." });
      if (newPassword.length < 8) return json(response, 400, { error: "Nowe hasło musi mieć minimum 8 znaków." });
      database.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hashPassword(newPassword), user.id);
      database.prepare("DELETE FROM sessions WHERE user_id = ? AND token != ?").run(user.id, getToken(request));
      return json(response, 200, { ok: true });
    }
    if (request.url === "/api/account" && request.method === "DELETE") {
      const user = getUser(request);
      if (!user) return json(response, 401, { error: "Musisz być zalogowany." });
      const { password = "" } = await readJson(request);
      const account = database.prepare("SELECT password_hash FROM users WHERE id = ?").get(user.id);
      if (!verifyPassword(password, account.password_hash)) return json(response, 400, { error: "Hasło jest nieprawidłowe." });
      database.prepare("DELETE FROM users WHERE id = ?").run(user.id);
      return json(response, 200, { ok: true }, { "Set-Cookie": "session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
    }
    if (request.url.startsWith("/api/")) return json(response, 404, { error: "Nieznany endpoint API." });
    if (request.method !== "GET") return json(response, 405, { error: "Method not allowed" });
    const pathname = new URL(request.url, "http://localhost").pathname;
    const relativePath = pathname === "/" ? "index.html" : normalize(pathname).replace(/^[/\\]+/, "");
    if (relativePath.startsWith("..") || relativePath.split(/[/\\]/).some((part) => part.startsWith(".")) || relativePath.startsWith("backend/") || ["package.json"].includes(relativePath)) return json(response, 404, { error: "Not found" });
    const file = await readFile(join(root, relativePath));
    response.writeHead(200, { "Content-Type": mimeTypes[extname(relativePath)] || "application/octet-stream" });
    response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") return json(response, 404, { error: "Not found" });
    console.error(error);
    json(response, 500, { error: "Wewnętrzny błąd serwera." });
  }
});

const port = Number(process.env.PORT) || 3000;
server.listen(port, () => console.log(`LoL Manager działa na http://localhost:${port}`));

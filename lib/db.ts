// Mock database for build-time to avoid better-sqlite3 initialization
const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production' && !global.db;

let db: any = null;

function getDb() {
    if (db) return db;

    // If we're at build time, return a mock
    if (isBuildTime) {
        return null;
    }

    // Runtime: use actual better-sqlite3
    const Database = require('better-sqlite3');
    const path = require('path');
    const fs = require('fs');

    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'marveledge.db');
    db = new Database(dbPath);
    (global as any).db = db;

    db.pragma('journal_mode = WAL');

    db.exec(`
    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_filename TEXT,
      share_token TEXT UNIQUE NOT NULL,
      duration REAL,
      size INTEGER,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id INTEGER NOT NULL,
      views INTEGER DEFAULT 0,
      watch_events TEXT DEFAULT '[]',
      last_viewed INTEGER,
      FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_share_token ON videos(share_token);
    CREATE INDEX IF NOT EXISTS idx_video_id ON analytics(video_id);
  `);

    return db;
}

export const videoDb = {
    create: (data: { filename: string; originalFilename?: string; shareToken: string; duration?: number; size?: number }) => {
        const database = getDb();
        if (!database) return 0;
        const stmt = database.prepare(`
      INSERT INTO videos (filename, original_filename, share_token, duration, size)
      VALUES (?, ?, ?, ?, ?)
    `);
        const result = stmt.run(data.filename, data.originalFilename, data.shareToken, data.duration, data.size);
        return result.lastInsertRowid as number;
    },

    getByToken: (shareToken: string) => {
        const database = getDb();
        if (!database) return null;
        const stmt = database.prepare('SELECT * FROM videos WHERE share_token = ?');
        return stmt.get(shareToken) as any;
    },

    getById: (id: number) => {
        const database = getDb();
        if (!database) return null;
        const stmt = database.prepare('SELECT * FROM videos WHERE id = ?');
        return stmt.get(id) as any;
    },

    list: (limit = 50) => {
        const database = getDb();
        if (!database) return [];
        const stmt = database.prepare('SELECT * FROM videos ORDER BY created_at DESC LIMIT ?');
        return stmt.all(limit) as any[];
    },

    delete: (id: number) => {
        const database = getDb();
        if (!database) return;
        const stmt = database.prepare('DELETE FROM videos WHERE id = ?');
        return stmt.run(id);
    },
};

export const analyticsDb = {
    initForVideo: (videoId: number) => {
        const database = getDb();
        if (!database) return;
        const stmt = database.prepare(`
      INSERT INTO analytics (video_id, views, watch_events)
      VALUES (?, 0, '[]')
      ON CONFLICT(video_id) DO UPDATE SET video_id = video_id
    `);
        stmt.run(videoId);
    },

    incrementView: (videoId: number) => {
        const database = getDb();
        if (!database) return;
        const stmt = database.prepare(`
      UPDATE analytics
      SET views = views + 1, last_viewed = strftime('%s', 'now')
      WHERE video_id = ?
    `);
        stmt.run(videoId);
    },

    addWatchEvent: (videoId: number, percentage: number) => {
        const database = getDb();
        if (!database) return;
        const analytics = analyticsDb.get(videoId);
        const events = analytics ? JSON.parse(analytics.watch_events || '[]') : [];
        events.push({
            timestamp: Date.now(),
            percentage: Math.round(percentage * 100) / 100,
        });

        const stmt = database.prepare(`
      UPDATE analytics
      SET watch_events = ?
      WHERE video_id = ?
    `);
        stmt.run(JSON.stringify(events), videoId);
    },

    get: (videoId: number) => {
        const database = getDb();
        if (!database) return null;
        const stmt = database.prepare('SELECT * FROM analytics WHERE video_id = ?');
        return stmt.get(videoId) as any;
    },
};

export default getDb;

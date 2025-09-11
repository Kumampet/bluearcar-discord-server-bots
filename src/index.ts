import { Hono } from 'hono';
import { DiscordHono } from 'discord-hono';
import 'dotenv/config';

// Botの公開鍵を環境変数から取得
const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Honoアプリケーションを初期化
const app = new Hono();

// DiscordHono を使用してDiscordのインタラクションを処理（PUBLIC_KEY を提供）
const discord = new DiscordHono({
  discordEnv: () => ({ PUBLIC_KEY: PUBLIC_KEY as string })
} as any);

// 'hello' コマンドの処理
discord.command('hello', (c: any) => {
  return c.res('Hello, Discord!');
});

// HonoアプリケーションにDiscordHonoをマウント
app.route('/api', discord as any);

// Workerがリクエストを受け取った際の処理を定義
export default app;

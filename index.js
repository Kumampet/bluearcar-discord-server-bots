import {
    verifyKey
} from 'discord-interactions';

// Discordの公開鍵を環境変数から取得
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

export const handler = async (event) => {
    // リクエストボディとヘッダーを取得
    const signature = event.headers['x-signature-ed25519'];
    const timestamp = event.headers['x-signature-timestamp'];
    const rawBody = event.body;

    // Discordからのリクエストを検証
    const isVerified = verifyKey(rawBody, signature, timestamp, DISCORD_PUBLIC_KEY);
    if (!isVerified) {
        return {
            statusCode: 401,
            body: 'invalid request signature'
        };
    }

    // リクエストボディをJSONにパース
    const body = JSON.parse(rawBody);
    const {
        type,
        data
    } = body;

    // DiscordのPingリクエスト（接続確認）に応答
    if (type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 1
            }),
        };
    }

    // スラッシュコマンドに応答
    if (type === 2 && data.name === 'hello') {
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 4,
                data: {
                    content: 'Hello, Discord!',
                },
            }),
        };
    }

    // その他のリクエストは無視
    return {
        statusCode: 400,
        body: 'unsupported request type'
    };
};

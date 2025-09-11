import { verifyKey } from 'discord-interactions';

// Discord開発者ポータルから取得した公開鍵を環境変数に設定してください
const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Discordからのリクエストであることを検証
  const signature = event.headers['x-signature-ed25519'];
  const timestamp = event.headers['x-signature-timestamp'];
  const body = event.body;

  if (!signature || !timestamp || !body || !PUBLIC_KEY) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Bad Request: Missing headers or public key" })
    };
  }

  try {
    const isValid = verifyKey(body, signature, timestamp, PUBLIC_KEY);
    if (!isValid) {
      console.log('Invalid request signature');
      return {
        statusCode: 401,
        body: 'Invalid Request Signature'
      };
    }
  } catch (err) {
    console.error('Signature verification failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }

  // 検証に成功した場合、ボディをパース
  const requestBody = JSON.parse(body);

  // Pingリクエスト (type: 1) の処理
  if (requestBody.type === 1) {
    console.log("Ping request received. Responding with type 1.");
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 1
      })
    };
  }

  // スラッシュコマンド (type: 2) の処理
  if (requestBody.type === 2) {
    const commandName = requestBody.data.name;
    console.log(`Command received: ${commandName}`);

    // '/hello' コマンドの処理
    if (commandName === "hello") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: 4, // 'CHANNEL_MESSAGE_WITH_SOURCE'
          data: {
            content: "Hello, Discord!"
          }
        })
      };
    }
  }

  // どのタイプにも一致しない無効なリクエストの処理
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Invalid request type"
    })
  };
};
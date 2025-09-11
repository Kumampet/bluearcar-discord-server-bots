export const handler = async (event: any) => {
  console.log('Hello, Discord!');
  // Discordからのリクエストヘッダーを取得
  const headers = event.headers;
  // リクエストボディを取得
  const body = JSON.parse(event.body);

  // Discordからの署名検証（セキュリティのため）
  const signature = headers['x-signature-ed25519'];
  const timestamp = headers['x-signature-timestamp'];

  // Discordの公開鍵を使って署名を検証するロジックをここに書く
  // 検証が失敗した場合はエラーを返す

  // Pingリクエスト（Discordが生存確認のために送るリクエスト）への応答
  if (body.type === 1) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: 1
      })
    };
  }

  // コマンドリクエストの処理
  if (body.type === 2) {
    const commandName = body.data.name;

    if (commandName === 'hello') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          type: 4, // 'CHANNEL_MESSAGE_WITH_SOURCE'
          data: {
            content: 'Hello, Discord!',
          }
        })
      };
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: 'Invalid request'
    })
  };
};
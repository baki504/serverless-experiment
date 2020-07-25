import * as express from "express";
import * as serverless from "serverless-http";
import * as aws from "aws-sdk";
import * as bodyParser from "body-parser";

const app: express.Application = express();

/**
 * dynamodbClient 開発
 */
const localDynamodb: aws.DynamoDB.DocumentClient = new aws.DynamoDB.DocumentClient(
  {
    region: "ap-northeast-1",
    endpoint: "http://localhost:3030",
  }
);

/**
 * dynamodbClient 本番
 */
const dynamodb: aws.DynamoDB.DocumentClient = new aws.DynamoDB.DocumentClient({
  region: "ap-northeast-1",
});

/**
 *
 * IPによって環境ごとのDynamoClientを返す
 * @param {string} ip
 * @returns
 */
const getDynamodbClient = (ip: string): aws.DynamoDB.DocumentClient => {
  return ip === "127.0.0.1" ? localDynamodb : dynamodb;
};

/**
 * bodyParserの設定
 */
app.use(bodyParser.json({ strict: false }));

/**
 * アクセスコントロールの設定
 */
app.use(
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  }
);

/**
 * アイテム一覧の取得
 */
app.get(
  "/api/items",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const dynamodb = getDynamodbClient(req.ip);
    const params = {
      TableName: "items",
      Limit: 100,
    };
    const result: aws.DynamoDB.ScanOutput = await dynamodb
      .scan(params)
      .promise();
    res.json({ items: result.Items });
  }
);

/**
 * アイテムの取得
 */
app.get(
  "/api/items/:id",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const dynamodb = getDynamodbClient(req.ip);
    const params = {
      TableName: "items",
      Key: {
        id: req.params.id,
      },
    };
    const result: aws.DynamoDB.GetItemOutput = await dynamodb
      .get(params)
      .promise();
    res.json({ article: result.Item });
  }
);

/**
 * アイテムの更新
 */
app.put(
  "/api/items/:id/update",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const dynamodb = getDynamodbClient(req.ip);
    const params = {
      TableName: "items",
      Key: {
        id: req.params.id,
      },
      UpdateExpression:
        "set title = :title, description = :description, modified_at = :modified_at",
      ExpressionAttributeValues: {
        ":title": req.body.title,
        ":description": req.body.description,
        ":modified_at": req.body.modified_at,
      },
      ReturnValues: "UPDATED_NEW",
    };
    try {
      const result = await dynamodb.update(params).promise();
      res.json(result);
    } catch (error) {
      res.json({ error });
    }
  }
);

/**
 * アイテムの作成
 */
app.post(
  "/api/items/create",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const dynamodb = getDynamodbClient(req.ip);
    const params = {
      TableName: "items",
      Item: {
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        created_at: new Date().getTime(),
        modified_at: new Date().getTime(),
      },
    };
    try {
      const result = await dynamodb.put(params).promise();
      res.json(result);
    } catch (error) {
      res.json({ error });
    }
  }
);

/**
 * アイテムの削除
 */
app.delete(
  "/api/items/:id/delete",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const dynamodb = getDynamodbClient(req.ip);
    const params = {
      TableName: "items",
      Key: {
        id: req.params.id,
      },
    };
    try {
      const result = await dynamodb.delete(params).promise();
      res.json(result);
    } catch (error) {
      res.json({ error });
    }
  }
);

export const handler = serverless(app);

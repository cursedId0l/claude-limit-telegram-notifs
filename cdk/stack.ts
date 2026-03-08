import * as path from "path";
import { CfnOutput, Duration, Stack } from "aws-cdk-lib";
import { FunctionUrlAuthType, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import type { StackProps } from "aws-cdk-lib";

export class BotStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const isBootstrap = this.node.tryGetContext("isBootstrap") === true;

    const requireEnv = (name: string): string => {
      const value = process.env[name];
      if (!value && !isBootstrap)
        throw new Error(`Missing required env var for deploy: ${name}`);
      return value ?? "";
    };

    const fn = new NodejsFunction(this, "Bot", {
      entry: path.join(__dirname, "../src/index.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(30),
      memorySize: 256,
      environment: {
        TELEGRAM_BOT_TOKEN: requireEnv("TELEGRAM_BOT_TOKEN"),
        TELEGRAM_WEBHOOK_SECRET: requireEnv("TELEGRAM_WEBHOOK_SECRET"),
      },
    });

    // Function URL gives the Lambda a public HTTPS endpoint
    const fnUrl = fn.addFunctionUrl({ authType: FunctionUrlAuthType.NONE });

    // Prints the URL after deploy so you can register it as your Telegram webhook
    new CfnOutput(this, "WebhookBaseUrl", { value: fnUrl.url });
  }
}

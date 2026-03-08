import { App } from "aws-cdk-lib";
import { BotStack } from "./stack";

const isBootstrap = process.env.CDK_BOOTSTRAPPING === "true";
const app = new App({ context: { isBootstrap } });

new BotStack(app, "TelegramForwarderBot", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

import * as restify from "restify";
import { BotFrameworkAdapter } from "botbuilder";

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await context.sendActivity("Welcome!");
  });
});

// for health check
server.get("/", (req, res) => {
  res.send("Hello World!");
});

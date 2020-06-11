import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
} from "botbuilder";

export class Bot extends TeamsActivityHandler {
  conversationState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    const receivedMessageState = this.conversationState.createProperty(
      "RECEIVED_MESSAGES"
    );

    this.onMessage(async (turnContext, next) => {
      const receivedMessages = await receivedMessageState.get(turnContext, []);
      receivedMessages.push(turnContext.activity.text);
      await turnContext.sendActivity(
        `Received Messages: ${receivedMessages.join(",")}`
      );

      await next();
    });
  }

  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
  }
}

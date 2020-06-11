import {
  TeamsActivityHandler,
  TurnContext,
  ConversationReference,
} from "botbuilder";

interface conversationReferences {
  [k: string]: Partial<ConversationReference>;
}

export class Bot extends TeamsActivityHandler {
  conversationReferences: conversationReferences;

  constructor() {
    super();

    this.conversationReferences = {};

    this.onConversationUpdate(async (context, next) => {
      console.log("onConversationUpdate called");
      this.addConversationReference(context.activity);
      await next();
    });

    this.onMessage(async (context, next) => {
      console.log("onMessage called");
      this.addConversationReference(context.activity);
      await context.sendActivity(`MyBot: You sent '${context.activity.text}'`);
      await next();
    });
  }

  addConversationReference(activity): void {
    const conversationReference = TurnContext.getConversationReference(
      activity
    );
    this.conversationReferences[
      conversationReference.conversation.id
    ] = conversationReference;
  }
}

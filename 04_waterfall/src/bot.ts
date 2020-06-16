import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
} from "botbuilder";
import { DialogSet, DialogTurnStatus, TextPrompt } from "botbuilder-dialogs";

const ASK_NAME = "ASK_NAME";

export class Bot extends TeamsActivityHandler {
  conversationState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    const dialogState = this.conversationState.createProperty("DialogState");
    const dialogSet = new DialogSet(dialogState);

    dialogSet.add(new TextPrompt(ASK_NAME));

    this.onMessage(async (context, next) => {
      const dialogContext = await dialogSet.createContext(context as any);
      const results = await dialogContext.continueDialog();
      console.log(results);

      if (results.status === DialogTurnStatus.empty) {
        await context.sendActivity(`名前を入力してね`);
        await dialogContext.beginDialog(ASK_NAME);
        // await dialogContext.prompt(ASK_NAME, "名前を入力してね"); // Syntax Sugar
      } else if (results.status === DialogTurnStatus.complete) {
        await context.sendActivity(`ようこそ、 ${results.result}さん`);
      }

      await next();
    });
  }

  async run(context) {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
  }
}

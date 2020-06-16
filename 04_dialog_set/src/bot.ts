import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
  UserState,
} from "botbuilder";
import { DialogSet, DialogTurnStatus, TextPrompt } from "botbuilder-dialogs";

const ASK_NAME = "ASK_NAME";

export class Bot extends TeamsActivityHandler {
  conversationState: any;
  userState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);
    const dialogState = this.conversationState.createProperty("DialogState");
    const dialogSet = new DialogSet(dialogState);
    dialogSet.add(new TextPrompt(ASK_NAME));

    this.onMessage(async (context, next) => {
      const dialogContext = await dialogSet.createContext(context as any);
      const results = await dialogContext.continueDialog();

      if (results.status === DialogTurnStatus.empty) {
        await dialogContext.prompt(ASK_NAME, "名前を入力してね");
      } else if (results.status === DialogTurnStatus.complete) {
        context.sendActivity(`ようこそ、 ${results.result}さん`);
      }

      await next();
    });
  }

  async run(context) {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}

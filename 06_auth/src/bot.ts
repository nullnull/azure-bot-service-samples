import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
  UserState,
} from "botbuilder";
import { MainDialog } from "./main";

export class Bot extends TeamsActivityHandler {
  conversationState: any;
  userState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);
    const dialog = new MainDialog();
    const dialogState = this.conversationState.createProperty("DialogState");

    this.onMessage(async (context, next) => {
      console.log("Running dialog with Message Activity.");

      await dialog.run(context, dialogState);
      await next();
    });
  }

  async run(context) {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}

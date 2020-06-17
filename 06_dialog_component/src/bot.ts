import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
  UserState,
  StatePropertyAccessor,
} from "botbuilder";
import { Dialog } from "./dialog";
import { DialogState } from "botbuilder-dialogs";

export class Bot extends TeamsActivityHandler {
  conversationState: any;
  userState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);
    const dialog = new Dialog(this.userState);
    const dialogState: StatePropertyAccessor<DialogState> = this.conversationState.createProperty("DialogState");

    this.onMessage(async (context, next) => {
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

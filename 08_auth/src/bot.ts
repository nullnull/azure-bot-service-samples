import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
  UserState,
} from "botbuilder";
import { MainDialog } from "./dialog/main";

export class Bot extends TeamsActivityHandler {
  conversationState: any;
  userState: any;
  dialog: any;
  dialogState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);
    this.dialog = new MainDialog();
    this.dialogState = this.conversationState.createProperty("DialogState");

    this.onMessage(async (context, next) => {
      console.log("Running dialog with Message Activity.");

      await this.dialog.run(context, this.dialogState);
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          await context.sendActivity(
            "Welcome to TeamsBot. Type anything to get logged in. Type 'logout' to sign-out."
          );
        }
      }

      await next();
    });
  }

  async handleTeamsSigninVerifyState(context, state) {
    await this.dialog.run(context, this.dialogState);
  }

  async run(context) {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}

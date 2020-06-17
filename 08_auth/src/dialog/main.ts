import {
  DialogSet,
  DialogTurnStatus,
  OAuthPrompt,
  TextPrompt,
  WaterfallDialog,
} from "botbuilder-dialogs";
import { LogoutDialog } from "./logout";

const MAIN_WATERFALL_DIALOG = "mainWaterfallDialog";
const OAUTH_PROMPT = "oAuthPrompt";
const TEXT_PROMPT = "textPrompt";

export class MainDialog extends LogoutDialog {
  constructor() {
    super("MainDialog", process.env.ConnectionName);

    this.addDialog(
      new OAuthPrompt(OAUTH_PROMPT, {
        connectionName: process.env.ConnectionName,
        text: "Please login",
        title: "Login",
        timeout: 300000,
      })
    )
      .addDialog(new TextPrompt(TEXT_PROMPT))
      .addDialog(
        new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
          this.promptStep.bind(this),
          this.loginStep.bind(this),
        ])
      );

    this.initialDialogId = MAIN_WATERFALL_DIALOG;
  }

  async run(turnContext, accessor) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async promptStep(step) {
    console.log("promptStep");

    return step.beginDialog(OAUTH_PROMPT);
  }

  async loginStep(step) {
    console.log("loginStep");

    const tokenResponse = step.result;
    console.log({ tokenResponse });

    if (tokenResponse) {
      await step.context.sendActivity("You are now logged in.");
      await step.context.sendActivity(`Your token is ${tokenResponse.token}`);
    } else {
      await step.context.sendActivity(
        "Login was not successful please try again."
      );
    }

    return await step.endDialog();
  }
}

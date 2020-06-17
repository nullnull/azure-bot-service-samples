import { InputHints } from "botbuilder";
import { ComponentDialog, DialogTurnStatus } from "botbuilder-dialogs";

export class CancelAndHelpDialog extends ComponentDialog {
  async onContinueDialog(innerDc) {
    const result = await this.interrupt(innerDc);
    if (result) {
      return result;
    }
    return await super.onContinueDialog(innerDc);
  }

  async interrupt(innerDc) {
    if (innerDc.context.activity.text) {
      const text = innerDc.context.activity.text.toLowerCase();

      switch (text) {
        case "help":
        case "?": {
          const helpMessageText = "Show help here";
          await innerDc.context.sendActivity(
            helpMessageText,
            helpMessageText,
            InputHints.ExpectingInput
          );
          return { status: DialogTurnStatus.waiting };
        }
        case "cancel":
        case "quit": {
          const cancelMessageText = "Cancelling...";
          await innerDc.context.sendActivity(
            cancelMessageText,
            cancelMessageText,
            InputHints.IgnoringInput
          );
          return await innerDc.cancelAllDialogs();
        }
      }
    }
  }
}

import { TurnContext, UserState, StatePropertyAccessor } from "botbuilder";
import {
  ComponentDialog,
  ConfirmPrompt,
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
} from "botbuilder-dialogs";

const CONFIRM_PROMPT = "CONFIRM_PROMPT";
const NAME_PROMPT = "NAME_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";

export class Dialog extends ComponentDialog {
  userProfileState: StatePropertyAccessor<any>;

  constructor(userState: UserState) {
    super("userProfileDialog");

    this.userProfileState = userState.createProperty(USER_PROFILE);

    this.addDialog(new TextPrompt(NAME_PROMPT));
    this.addDialog(new ConfirmPrompt(CONFIRM_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.nameStep.bind(this),
        this.confirmStep.bind(this),
        this.summaryStep.bind(this),
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG;
  }

  async run(turnContext: TurnContext, dialogState: any) {
    const dialogSet = new DialogSet(dialogState);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext as any);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async nameStep(step) {
    return await step.prompt(NAME_PROMPT, "Please enter your name.");
  }

  async confirmStep(step) {
    step.values.name = step.result;
    await step.context.sendActivity(`Thanks ${step.values.name}.`);
    return await step.prompt(CONFIRM_PROMPT, "Do you want to keep your name?");
  }

  async summaryStep(step) {
    if (step.result) {
      await this.userProfileState.set(step.context, {
        name: step.values.name,
      });
      await step.context.sendActivity(
        `OK. I'll remember your name ${step.values.name}`
      );
    } else {
      await step.context.sendActivity("Thanks. Your profile will not be kept.");
    }

    await step.context.sendActivity(`Finished`);
    return await step.endDialog();
  }
}

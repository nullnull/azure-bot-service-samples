import { TurnContext, UserState, StatePropertyAccessor } from "botbuilder";
import {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
} from "botbuilder-dialogs";

import { QUESTION_2_DIALOG, Question2Dialog } from "./question2";

const QUESTION_PROMPT = "QUESTION_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
export const QUESTION_1_DIALOG = "QUESTION_1_DIALOG";

export class Question1Dialog extends ComponentDialog {
  userProfileState: StatePropertyAccessor<any>;

  constructor(userState: UserState) {
    super(QUESTION_1_DIALOG);

    this.userProfileState = userState.createProperty(USER_PROFILE);

    this.addDialog(new Question2Dialog(userState));
    this.addDialog(new TextPrompt(QUESTION_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.questionStep.bind(this),
        this.answerStep.bind(this),
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

  async questionStep(step) {
    return await step.prompt(QUESTION_PROMPT, "Question1: XXX?");
  }

  async answerStep(step) {
    const userState = await this.userProfileState.get(step.context, {});
    userState.answer1 = step.result;

    await step.context.sendActivity(`Answer1: ${step.result}`);

    return await step.beginDialog(QUESTION_2_DIALOG);
  }
}

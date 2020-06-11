import { TurnContext, UserState, StatePropertyAccessor } from "botbuilder";
import {
  ComponentDialog,
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
} from "botbuilder-dialogs";

const QUESTION_PROMPT = "QUESTION_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";
export const QUESTION_3_DIALOG = "QUESTION_3_DIALOG";

export class Question3Dialog extends ComponentDialog {
  userProfileState: StatePropertyAccessor<any>;

  constructor(userState: UserState) {
    super(QUESTION_3_DIALOG);

    this.userProfileState = userState.createProperty(USER_PROFILE);

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
    return await step.prompt(QUESTION_PROMPT, "Question3: XXX?");
  }

  async answerStep(step) {
    const userState = await this.userProfileState.get(step.context, {});
    userState.answer3 = step.result;

    await step.context.sendActivity(
      `Answer1: ${userState.answer1}, Answer2: ${userState.answer2}, Answer3: ${userState.answer3}`
    );

    return await step.endDialog();
  }
}

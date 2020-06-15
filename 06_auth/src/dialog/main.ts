import { TurnContext, UserState, StatePropertyAccessor } from "botbuilder";
import {
  ComponentDialog,
  ChoiceFactory,
  ChoicePrompt,
  DialogSet,
  DialogTurnStatus,
  WaterfallDialog,
} from "botbuilder-dialogs";

import { QUESTION_1_DIALOG, Question1Dialog } from "./question1";
import { QUESTION_2_DIALOG, Question2Dialog } from "./question2";
import { QUESTION_3_DIALOG, Question3Dialog } from "./question3";

const CHOICE_PROMPT = "CHOICE_PROMPT";
const USER_PROFILE = "USER_PROFILE";
const WATERFALL_DIALOG = "WATERFALL_DIALOG";

export class MainDialog extends ComponentDialog {
  userProfileState: StatePropertyAccessor<any>;

  constructor(userState: UserState) {
    super("userProfileDialog");

    this.userProfileState = userState.createProperty(USER_PROFILE);

    this.addDialog(new Question1Dialog(userState));
    this.addDialog(new Question2Dialog(userState));
    this.addDialog(new Question3Dialog(userState));
    this.addDialog(new ChoicePrompt(CHOICE_PROMPT));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG, [
        this.choiceStep.bind(this),
        this.startQuestionStep.bind(this),
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

  async choiceStep(step) {
    return await step.prompt(CHOICE_PROMPT, {
      prompt: "Please enter question no.",
      choices: ChoiceFactory.toChoices(["1", "2", "3"]),
    });
  }

  async startQuestionStep(step) {
    console.log(step.result.value);

    if (step.result.value == "1") {
      return await step.beginDialog(QUESTION_1_DIALOG);
    } else if (step.result.value == "2") {
      return await step.beginDialog(QUESTION_2_DIALOG);
    } else if (step.result.value == "3") {
      return await step.beginDialog(QUESTION_3_DIALOG);
    } else {
      await step.context.sendActivity(`selection failed`);
      return await step.endDialog();
    }
  }
}

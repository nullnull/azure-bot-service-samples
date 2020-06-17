import { TurnContext, UserState, StatePropertyAccessor } from "botbuilder";
import {
  ComponentDialog,
  ConfirmPrompt,
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
  DialogState,
} from "botbuilder-dialogs";

interface StepValue {
  name?: string;
}

const COMPONENT_DIALOG_ID = "COMPONENT_DIALOG_ID"
const ASK_NAME_DIALOG_ID = "ASK_NAME_DIALOG_ID";
const CONFIRM_NAME_DIALOG_ID = "CONFIRM_NAME_DIALOG_ID";
const WATERFALL_DIALOG_ID = "WATERFALL_DIALOG_ID";
const USER_PROFILE_PROPERTY_ID = "USER_PROFILE_PROPERTY_ID"

export class Dialog extends ComponentDialog {
  userProfileState: StatePropertyAccessor<any>;

  constructor(userState: UserState) {
    super(COMPONENT_DIALOG_ID);

    this.userProfileState = userState.createProperty(USER_PROFILE_PROPERTY_ID);

    this.addDialog(new TextPrompt(ASK_NAME_DIALOG_ID));
    this.addDialog(new ConfirmPrompt(CONFIRM_NAME_DIALOG_ID));

    this.addDialog(
      new WaterfallDialog(WATERFALL_DIALOG_ID, [
        this.nameStep.bind(this),
        this.confirmStep.bind(this),
        this.summaryStep.bind(this),
      ])
    );

    this.initialDialogId = WATERFALL_DIALOG_ID;
  }

  async run(turnContext: TurnContext, dialogState: StatePropertyAccessor<DialogState>) {
    const dialogSet = new DialogSet(dialogState as any);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(turnContext as any);
    console.log(dialogContext.stack);
    if (dialogContext.stack.length > 0) {
      console.log(dialogContext.stack[0].state.dialogs)
    }
    
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  async nameStep(step) {
    return await step.prompt(ASK_NAME_DIALOG_ID, "名前を入力してね");
  }

  async confirmStep(step) {
    (step.values as StepValue).name = step.result;
    return await step.prompt(
      CONFIRM_NAME_DIALOG_ID,
      `${(step.values as StepValue).name}さんで宜しいですか？`
    );
  }

  async summaryStep(step) {
    if (step.result) {
      await step.context.sendActivity(
        `わかりました。${(step.values as StepValue).name}さん、こんにちは！`
      );
    } else {
      await step.context.sendActivity("もう一度最初から処理をやり直します。");
    }
  
    return await step.endDialog();
  }
}

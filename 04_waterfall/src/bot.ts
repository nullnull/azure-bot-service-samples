import {
  TeamsActivityHandler,
  MemoryStorage,
  ConversationState,
} from "botbuilder";
import {
  DialogSet,
  DialogTurnStatus,
  TextPrompt,
  ConfirmPrompt,
  WaterfallDialog,
  WaterfallStep,
} from "botbuilder-dialogs";

const ASK_NAME_DIALOG_ID = "ASK_NAME_DIALOG_ID";
const CONFIRM_NAME_DIALOG_ID = "CONFIRM_NAME_DIALOG_ID";
const WATERFALL_DIALOG_ID = "WATERFALL_DIALOG_ID";

interface StepValue {
  name?: string;
}

const askNameStep: WaterfallStep = async (step) => {
  return await step.prompt(ASK_NAME_DIALOG_ID, "名前を入力してね");
};

const confirmNameStep: WaterfallStep = async (step) => {
  (step.values as StepValue).name = step.result;
  return await step.prompt(
    CONFIRM_NAME_DIALOG_ID,
    `${(step.values as StepValue).name}さんで宜しいですか？`
  );
};

const completeStep: WaterfallStep = async (step) => {
  if (step.result) {
    await step.context.sendActivity(
      `わかりました。${(step.values as StepValue).name}さん、こんにちは！`
    );
  } else {
    await step.context.sendActivity("もう一度最初から処理をやり直します。");
  }

  return await step.endDialog();
};

export class Bot extends TeamsActivityHandler {
  conversationState: any;

  constructor() {
    super();

    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    const dialogState = this.conversationState.createProperty("DialogState");
    const dialogSet = new DialogSet(dialogState);

    dialogSet.add(new TextPrompt(ASK_NAME_DIALOG_ID));
    dialogSet.add(new ConfirmPrompt(CONFIRM_NAME_DIALOG_ID));
    dialogSet.add(
      new WaterfallDialog(WATERFALL_DIALOG_ID, [
        askNameStep,
        confirmNameStep,
        completeStep,
      ])
    );

    this.onMessage(async (context, next) => {
      const dialogContext = await dialogSet.createContext(context as any);

      console.log(dialogContext.stack);
      //
      // ここのstackの出力について、
      // 1. 対話が始まっていないときは空の配列
      // 2. 「名前を入力してね」と発言した後に、ユーザーからメッセージを受け取った時点のstackは以下
      //
      // [
      //   {
      //     id: 'WATERFALL_DIALOG_ID',
      //     state: { options: {}, values: [Object], stepIndex: 0 }
      //   },
      //   { id: 'ASK_NAME_DIALOG_ID', state: { options: [Object], state: {} } }
      // ]
      //
      // waterfall dialogの上に、更にprompt dialogが積まれているのが分かる。
      //

      // stackがあれば、stackの最後の対話を継続する。
      // 「名前を入力してね」の後であれば、ASK_NAME_DIALOG_IDの処理を完了させ、その結果をstep.resultに格納し、
      // 次のstepであるconfirmNameStepを実行し、CONFIRM_NAME_DIALOG_IDの対話を開始する。
      const results = await dialogContext.continueDialog();

      // stackがなければ、WATERFALL_DIALOG_IDの対話を開始する。
      // waterfall dialogが開始されると、最初のstepにあるpromptが対話スタックに積まれる。
      if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(WATERFALL_DIALOG_ID);
      }

      await next();
    });
  }

  async run(context) {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
  }
}

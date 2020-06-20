import { TeamsActivityHandler, MessageFactory, CardFactory } from "botbuilder";

// const heroCard = CardFactory.heroCard(
//   'White T-Shirt',
//   ['https://example.com/whiteShirt.jpg'],
//   ['buy']
// );

const heroCardWithoutImages = CardFactory.heroCard(
  "好きな番号を選んでね",
  [],
  ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
);

export class Bot extends TeamsActivityHandler {
  conversationState: any;

  constructor() {
    super();

    this.onMessage(async (context, next) => {
      const message = MessageFactory.attachment(heroCardWithoutImages);
      await context.sendActivity(message);

      await next();
    });
  }
}

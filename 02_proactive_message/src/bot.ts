import { TeamsActivityHandler, TeamsInfo, TurnContext } from 'botbuilder';

export class Bot extends TeamsActivityHandler {
    constructor(conversationReferences) {
        super();
        
        this.onConversationUpdate(async (context, next) => {
            console.log('onConversationUpdate called');
            
            addConversationReference(context.activity);
            await next();
        });

        this.onMessage(async (context, next) => {
            console.log('onMessage called');

            const members = await TeamsInfo.getMembers(context);
            console.log('teams members');
            console.log({members});

            addConversationReference(context.activity);
            await context.sendActivity(`MyBot: You sent '${ context.activity.text }'`);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            console.log('onMembersAdded called');
            
            const members = await TeamsInfo.getMembers(context);
            console.log('teams members');
            console.log({members});

            const membersAdded = context.activity.membersAdded;
            for (const member of membersAdded) {
                // if (member.id !== context.activity.recipient.id) {
                //     await context.sendActivity('Welcome to the Proactive Bot sample');
                // }
                await context.sendActivity('Welcome to the Proactive Bot sample');
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        function addConversationReference(activity): void {
            const conversationReference = TurnContext.getConversationReference(activity);
            conversationReferences[conversationReference.conversation.id] = conversationReference;
        }
    }
}
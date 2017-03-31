var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());





bot.dialog('/', [
    function (session) {
        // Send a greeting and show help.
        var card = new builder.HeroCard(session)
            .title("Shirsendu's Dugu")
            .text("Your son - wherever your users are talking.")
            .images([
                 builder.CardImage.create(session, "http://nebula.wsimg.com/8cb7cc28d52b39788330a7d513954a70?AccessKeyId=CE0181346087D63602EE&disposition=0&alloworigin=1")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm Dugu not a  bot for Skype.");
        session.beginDialog('rootMenu');
    },
    
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('rootMenu', [
    function (session) {
        builder.Prompts.choice(session, "Choose an option:", 'Flip A Coin|Roll Dice|Magic 8-Ball|Quit');
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('flipCoinDialog');
                break;
            case 1:
                session.beginDialog('rollDiceDialog');
                break;
            case 2:
                session.beginDialog('magicBallDialog');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('rootMenu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

bot.dialog('flipCoinDialog', [
    function (session, args) {
        builder.Prompts.choice(session, "Choose heads or tails.", "heads|tails", { listStyle: builder.ListStyle.none })
    },
    function (session, results) {
        var flip = Math.random() > 0.5 ? 'heads' : 'tails';
        if (flip == results.response.entity) {
             var card = new builder.HeroCard(session)
             .title("Shirsendu's Dugu")
            .text("My  son - will be winner.")
            .images([
                 builder.CardImage.create(session, "http://nebula.wsimg.com/8cb7cc28d52b39788330a7d513954a70?AccessKeyId=CE0181346087D63602EE&disposition=0&alloworigin=1")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
            session.endDialog("It's %s. YOU WIN!", flip);
        } else {
            session.endDialog("Sorry... It was %s. you lost :(", flip);
        }
    }
]);

bot.dialog('rollDiceDialog', [
    function (session, args) {
        builder.Prompts.number(session, "How many dice should I roll?");
    },
    function (session, results) {
        if (results.response > 0) {
            var msg = "I rolled:";
            for (var i = 0; i < results.response; i++) {
                var roll = Math.floor(Math.random() * 6) + 1;
                msg += ' ' + roll.toString(); 
            }
            var card = new builder.HeroCard(session)
             .title("Shirsendu's Dugu")
            .text("My  son - will be rolling next time.")
            .images([
                 builder.CardImage.create(session, "http://nebula.wsimg.com/8cb7cc28d52b39788330a7d513954a70?AccessKeyId=CE0181346087D63602EE&disposition=0&alloworigin=1")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);

            session.endDialog(msg);
        } else {
            session.endDialog("Ummm... Ok... I rolled air.");
        }
    }
]);

bot.dialog('magicBallDialog', [
    function (session, args) {
        builder.Prompts.text(session, "What is your question?");
    },
    function (session, results) {
        // Use the SDK's built-in ability to pick a response at random.
        session.endDialog(magicAnswers);
    }
]);



var magicAnswers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

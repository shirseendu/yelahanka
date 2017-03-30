var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer({name: 'MyApp'});
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to bb %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('q&aDialog');
    },
    function (session, results) {
        session.send("Thanks %(name)s... You're %(age)s and located in %(state)s.", results.response);
    }
]);

server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

// bot.dialog('/',[
//  function (session) {
//         builder.Prompts.text(session, "Hello... What's your name?");
//     },
//     function (session, results) {
//         session.userData.name = results.response;
//         builder.Prompts.number(session, "Hi " + results.response + ", How many years have you been coding?"); 
//     },
//     function (session, results) {
//         session.userData.coding = results.response;
//         builder.Prompts.choice(session, "What language do you code Node using?", ["JavaScript", "CoffeeScript", "TypeScript"]);
//     },
//     function (session, results) {
//         session.userData.language = results.response.entity;
//         session.send("Got it... " + session.userData.name + 
//                      " you've been programming for " + session.userData.coding + 
//                      " years and use " + session.userData.language + ".");
//     }


// ]);





bot.dialog('q&aDialog', [
    function (session, args) {
        // Save previous state (create on first call)
        session.dialogData.index = args ? args.index : 0;
        session.dialogData.form = args ? args.form : {};

        // Prompt user for next field
        builder.Prompts.text(session, questions[session.dialogData.index].prompt);
    },
    function (session, results) {
        // Save users reply
        var field = questions[session.dialogData.index++].field;
        session.dialogData.form[field] = results.response;

        // Check for end of form
        if (session.dialogData.index >= questions.length) {
            // Return completed form
            session.endDialogWithResult({ response: session.dialogData.form });
        } else {
            // Next field
            session.replaceDialog('q&aDialog', session.dialogData);
        }
    }
]);

var questions = [
    { field: 'name', prompt: "What's your name?" },
    { field: 'age', prompt: "How old are you?" },
    { field: 'state', prompt: "What state are you in?" }
];
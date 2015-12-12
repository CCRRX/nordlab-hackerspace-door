var irc = require('irc');
var bot = new irc.Client('irc.lugfl.de', 'DoorBot', {
			debug: false,
			channels: ['#hackerspace'],
			autoRejoin: false,
			autoConnect: false,
			messageSplit: 1000000
		});
var request = require('request');
module.exports = {
	ircPreload: function (){
		bot.addListener('error', function(message) {
    		setTimeout(function() { 
    			// console.log("wait 7sek"); 
    		}, 7000);
    		bot.send('nick', 'DoorBot'); 
    		bot.say('NickServ', 'identify DoorBotPass');
		});
		setTimeout(function() { 
			// console.log("wait 7sek"); 
		}, 7000);
		bot.connect(10, function() {
			bot.send('nick', 'DoorBot');
    		bot.say('NickServ', 'identify DoorBotPass');
			bot.join('#hackerspace');
			//bot.say('#hackerspace', 'Door Bot is starting to watch on the Door Status');
		})
	},
	ircSend: function (door_status){
    	bot.say('#hackerspace', 'Door Status changed to: ' + door_status);
    	// bot.send('topic','#hackerspace "Hackerspace Flensburg - Treffen jeden Montag 18:00 Uhr im Offenen Kanal Flensburg! - Tür Status"' + door_status);
    	// console.log("IRC Door Status Chnaged");
	},
	ircStopp: function() {
		bot.disconnect('Bot was stopped!');
	},
	ircBotCommands: function(){
		bot.addListener('message', function (from, to, message) {
			message = message.toLowerCase();
			if (message == "!help"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "Here is your Help!\nCommand List:\n- !help - Shows this page.\n- !DoorStatus - Shows the actual Door Status in an PM\n- !DoorStatus channel - Shows the actual Door Status in the channel drom where it was run\n- !where - Shows the address of the Nordlab e.V.\n- !who - Shows who is allowed to come to the Nordlab e.V.\n- !when - Shows who the Nordlab e.V. Hackerspace usually is open");
    		}
    		if (message == "!hilfe"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "Hier ist die Hilfe!\nBefehl-liste:\n- !hilfe - Zeigt diese Seite.\n- !DoorStatus - Sendet eine PM mit dem aktuellen Status\n- !DoorStatus channel - Sendet in den Channel wo der Befehl ausgeführt wurde den aktuellen Status\n- !where - Zeigt die Addresse vom Nordlab e.V.\n- !who - Zeigt wer alles kommen darf Nordlab e.V.\n- !when - Zeigt wann der Nordlab e.V. Hackerspace geöffnet hat");
    		}
    		if (message == "!where"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "You can find the Hackerspace in:\nOffener Kanal Flensburg\nSt.-Jürgen-Straße 95\n24937 Flensburg\nAt the very Top of the building");
    		}
    		if (message == "!who"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "Everybody can come to the Norlab e.V.");
    		}
    		if (message == "!when"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "The Hackerpace of Norlab e.V. is usually opened every Monday at 6pm o'clock.");
    		}
    		if (message == "!source"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(from, "You can find the Source of this bot at https://github.com/MTRNord/nordlab-hackerspace-door");
    		}
    		if (message == "!klassiker"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(to, "Für mehr oder weniger hilfreiche Kommentare den klassiker fragen.");
    		}
    		if (message == "make me a sandwich"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(to, "REALLY??? DO IT ON YOUR OWN!! I am NOT your Maid!!");
    		}
    		if (message == "!stina"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(to, "Stina liebt unzielgerichteten Unsinn *lach*");
    		}
    		if (message == "!afk"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(to, from + " is now afk.");
    		}
    		if (message == "!alone"){
    			// console.log(from + ' => ' + to + ': ' + message);
    			bot.say(to, from + " is now alone.");
    		}
    		if (message == "!doorstatus"){
    			request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    				if (!error && response.statusCode == 200) {
      					door_status = body;
      					//console.log(body);
    				}else{
      					door_status = error;
      					//console.log(error);
    				}
    				if (door_status == "geschlossen"){
          				door_status = "closed";
        			}else{
          				door_status = "open";
        			}
    				// console.log(from + ' => ' + to + ': ' + message);
    				bot.say(from, "DoorStatus is: " + door_status);
    			}).setMaxListeners(0);
    		}
			var channel = message.split(" ");
    		if (message == "!doorstatus " + channel[channel.length-1]){
				request.get('http://www.nordlab-ev.de/doorstate/status.txt', function (error, response, body) {
    				if (!error && response.statusCode == 200) {
      					door_status = body;
      					//console.log(body);
    				}else{
      					door_status = error;
      					//console.log(error);
    				}
    				if (door_status == "geschlossen"){
          				door_status = "closed";
        			}else{
          				door_status = "open";
        			}
        			// console.log(message);
        			bot.list();
        			if (channel[channel.length-1] !== "this"){
        				bot.addListener('channellist', function (channel_list) {
        					for (var key in channel_list) {
  								if (channel_list.hasOwnProperty(key)) {
									if (channel_list[key]["name"] == channel[channel.length-1]) {
										// console.log("1");
    									bot.join(channel[channel.length-1]);
    									bot.say(channel[channel.length-1], "DoorStatus is: " + door_status);
									}
  								}
							}
						});
        			}else{
        				bot.join(to);
    					bot.say(to, "DoorStatus is: " + door_status);
        			}
    			}).setMaxListeners(0);
    		}
    		if (message == "!kill"){
    			if ((from == "DasNordlicht") || (from == "MTRNord")) {
    				// console.log(from + ' => ' + to + ': ' + message);
    			 	if (process.platform === "win32") {
      					var rl = require("readline").createInterface({
        					input: process.stdin,
        					output: process.stdout
      					});
      					bot.disconnect('Bot was stopped!');
      					process.exit();
					}
      			}
    		}
		})
	},
	ircNick: function() {
		bot.send('nick', 'DoorBot'); 
	}
};
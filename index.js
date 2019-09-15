const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const request = require('request');
const {Attachment} = require('discord.js');

const { Token } = require('./config');


client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  
    client.user.setPresence({ game: { name: "Simply Bot" } })
    .then(console.log)
    .catch(console.error);
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	const activities_list = [
    	"Default Prefix: _",
    	"Hoppy: twitter.com/drtortue"
    ];
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1);
    	client.user.setPresence(
		{
			status: "idle",
			afk: false,
			game:
			{
				name: activities_list[index],
				url: "https://twitch.tv/drtortue1",
				type: "STREAMING"
			}
		});
    }, 10000);

});


// Random Function
function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Get Marmiton Recipe
function GetMarmiton(id)
{
	request('https://localhost:8000/marmiton-api/', function (error, response, body)
	{
		let infojson = JSON.parse(body)
        console.log(String(infojson.title));
        console.log(infojson.title)
        client.channels.get(id).send({
            embed: {
                title: "La recette marmiton du jour :)",
                description: "**"+infojson.title+"**",
                url: infojson.url,
                color: 5110582,
                image: {
                  url: infojson.image
                },
                fields: [
                    {
                      name: "Note: "+infojson.rating,
                      value: "[La liste des avis.]("+infojson.avis+")"
                    }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: "https://i.imgur.com/BwyTIKQ.png",
                  text: "by Hoppy & Keeta"
                }
            }
        })
	});
}

// Get Image from site "Saviez vous que"
function GetSaviezVousQue(id)
{
    request("https://saviezvousque.net/page/" + getRandomInt(2, 1776), function (a, b, body)
    {
        var regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg)/g;
        var found = body.match(regex);

        var index = found.indexOf("https://s-media-cache-ak0.pinimg.com/736x/a9/ba/ed/a9baedecb8db1121c04ad09d52569c42.jpg"); // remove adblock url
        if (index > -1)
            found.splice(index, 1);

        let countfound = found.length;
        let randomimg = getRandomInt(1, countfound);
        if (!found[randomimg])
        {
            GetSaviezVousQue(id)
            return
        }

        client.channels.get(id).send({
            embed: 
            {
                color: Math.floor(Math.random() * 16777214) + 1,
                image: 
                {
                    url: found[randomimg]
                },
                footer:
                {
                    "icon_url": "https://i.imgur.com/CBYxtqH.png",
                    "text": "by Hoppy & Keeta"
                },
                timestamp: new Date()
            }
        })
    })
}

// Event get all message
client.on("message", message => {
	
	let prefix = "_";
	if (!message.content.startsWith(prefix)) return false; // Don't look the message without the prefix
	let messageLower = message.content.toLowerCase(); // Lower the string
	let messageNoPrefix = messageLower.replace(prefix, ""); // Remove prefix in check
	let messageArray = messageNoPrefix.split(" "); // Create Argument Array
	let cmd = messageArray[0]; 
	let args = messageArray.slice(1);
	
	
	if (message.channel instanceof Discord.DMChannel) return false; // Block private message
	switch (cmd)
	{
		// **** START COMMAND LIST ****
		case "ping":
			// **** START PING COMMAND ****
			var Ping = client.ping; // Get Ping of the bot
			switch (true) // Switch for a message for a different ping
			{
				case (Ping > 200 ):
					message.channel.send(`Houston, we have a problem.. ${Ping} ms`);
        				break;
				case (Ping < 200 && Ping > 100):
					message.channel.send(`Bon, faudrait penser à prendre un meilleur serveur.. ${Ping} ms`);
        				break; 
    	    			case (Ping < 100 && Ping > 15):
    	    				message.channel.send(`Il y a mieux mais c'est déjà bien. ${Ping} ms`);
       		 			break;
        			case (Ping < 15):
        				message.channel.send(`Le serveur de la nasa où je suis loué !! :O ${Ping} ms`);
        				break;
        		default:
        			message.channel.send("Et là c'est le bug..")
			}
			break;
			// **** END PING COMMAND ****
			// **** START Marmiton / Saviez Vous que COMMAND ****
		case "svq":
			GetSaviezVousQue(message.channel.id);
			break;
		case "marmiton":
			GetMarmiton(message.channel.id);
			break;
		// **** END Marmiton / Saviez Vous que COMMAND ****
			
		// **** END COMMAND LIST ****
		default:
			console.log(`Commande {${cmd}} effectué mais introuvable..`);
	}
});

client.login(Token);

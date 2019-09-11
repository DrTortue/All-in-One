const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require("fs");
const request = require('request');
const {Attachment} = require('discord.js');

const { Token, Marmiton_ID_Channel } = require('./config');


client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  
    client.user.setPresence({ game: { name: "Simply Bot" } })
    .then(console.log)
    .catch(console.error);
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
client.on('message', function(message)
{
    if (message.channel instanceof Discord.DMChannel) return false; // Block private message
    let messages = message.content.split(" ")
    
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);

    // Send Recipe in command "Marmiton"
    if (cmd === "marmiton")
    {
        GetMarmiton(message.channel.id);
    }

    // Send Image in command "SVQ"
    if (cmd === "SVQ")
    {
        GetSaviezVousQue(message.channel.id);
    }
});


client.login(Token);

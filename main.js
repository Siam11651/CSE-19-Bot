const prompt = require("prompt");

var DISCORD_BOT_TOKEN;
var TENOR_API_KEY;
var PIXABAY_API_KEY;
var YOUTUBE_API_KEY;

prompt.start();

prompt.get(["DISCORD_BOT_TOKEN", "TENOR_API_KEY", "PIXABAY_API_KEY", "YOUTUBE_API_KEY"], (error, result)=>
{
    if(!error)
    {
        DISCORD_BOT_TOKEN = result.DISCORD_BOT_TOKEN;
        TENOR_API_KEY = result.TENOR_API_KEY;
        PIXABAY_API_KEY = result.PIXABAY_API_KEY;
        YOUTUBE_API_KEY = result.YOUTUBE_API_KEY;

        console.clear();
        console.log("Starting...");
        client.login(DISCORD_BOT_TOKEN);
    }
});

const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();

function GetQuery(tokens)
{
    let query = "";

    for(let i = 1; i < tokens.length; i++)
    {
        if(i != 1)
        {
            query += " ";
        }

        query += tokens[i];
    }

    return encodeURIComponent(query);
}

async function GetGif(message, query)
{
    let url = "https://g.tenor.com/v1/search?q=" + query + "&key=" + TENOR_API_KEY + "&limit=50&contentfilter=high&media_filter=minimal&locale=en_US";
    let response = await fetch(url);
    let json = await response.json();
    let results = json.results;

    if(results.length === 0)
    {
        message.channel.send("Nothing found on your query 🥺.");
    }
    else
    {
        let index = Math.floor(Math.random() * results.length);

        message.channel.send(results[index].url);
    }
}

async function GetImg(message, query)
{
    let url = "https://pixabay.com/api/?key=" + PIXABAY_API_KEY + "&q=" + query + "&lang=en&image_type=photo&safesearch=true&order=latest&per_page=200&pretty=true";
    let response = await fetch(url);
    let json = await response.json();
    let hits = json.hits;

    if(hits.length === 0)
    {
        message.channel.send("Nothing found on your query 🥺.");
    }
    else
    {
        let index = Math.floor(Math.random() * hits.length);

        message.channel.send(json.hits[index].webformatURL);
    }
}

async function GetVideo(message, query)
{
    let url = "https://youtube.googleapis.com/youtube/v3/search?part=id&part=snippet&q=" + query + "&safeSearch=strict&key=" + YOUTUBE_API_KEY;
    let response = await fetch(url);
    let json = await response.json();
    let items = json.items;

    if(items.length === 0)
    {
        message.channel.send("Nothing found on your query 🥺.");
    }
    else
    {
        message.channel.send("https://www.youtube.com/watch?v=" + items[0].id.videoId);
    }
}

async function GetDadJoke(message, query)
{
    let url = "https://icanhazdadjoke.com/search?term=" + query + "&limit=3";
    
    let response = await fetch(url, 
    {
        headers:
        {
            "Accept": "application/json"
        }
    });

    let json = await response.json();
    let results = json.results;

    if(results.length === 0)
    {
        message.channel.send("Nothing found on your query 🥺.");
    }
    else
    {
        let index = Math.floor(Math.random() * results.length);

        message.channel.send(json.results[index].joke);
    }
}

client.on("ready", ()=>
{
    console.log("Client Ready");
});

client.on("message", (message)=>
{
    let tokens = message.content.split(" ");

    if(tokens.length > 0)
    {
        if(tokens[0].toLowerCase() === "help")
        {
            message.channel.send("Send \"./hemlp\" for hemlp.");
        }
        else if(tokens[0].toLowerCase() === "./hemlp")
        {
            message.channel.send("Commands:\n" +
            "./gif to show gifs\n" + 
            "./img to show images\n" + 
            "./play to play YouTube video\n" + 
            "./dadjoke for a dadjoke 👀");
        }
        else if(tokens[0].toLocaleLowerCase() === "./gif")
        {
            if(tokens.length > 1)
            {
                let query = GetQuery(tokens);

                GetGif(message, query);
            }
            else
            {
                message.channel.send("Please add search terms to search GIF.");
            }
        }
        else if(tokens[0].toLocaleLowerCase() === "./img")
        {
            if(tokens.length > 1)
            {
                let query = GetQuery(tokens);

                GetImg(message, query);
            }
            else
            {
                message.channel.send("Please add search terms to search images.");
            }
        }
        else if(tokens[0].toLocaleLowerCase() === "./play")
        {
            if(tokens.length > 1)
            {
                let query = GetQuery(tokens);

                GetVideo(message, query);
            }
            else
            {
                message.channel.send("Please add search terms to play.");
            }
        }
        else if(tokens[0].toLocaleLowerCase() === "./dadjoke")
        {
            if(tokens.length > 1)
            {
                let query = GetQuery(tokens);

                GetDadJoke(message, query);
            }
            else
            {
                message.channel.send("Please add search terms for dad jokes");
            }
        }
    }
});
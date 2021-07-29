const dotenv = require("dotenv").config();
const fetch = require("node-fetch");
const Discord = require("discord.js");
const client = new Discord.Client();

if(dotenv.error)
{
    console.log("cannot find a dotenv file. Exiting...");

    process.exit(0);
}

const DISCORD_BOT_TOKEN = dotenv.parsed.DISCORD_BOT_TOKEN;
const TENOR_API_KEY = dotenv.parsed.TENOR_API_KEY;
const PIXABAY_API_KEY = dotenv.parsed.PIXABAY_API_KEY;
const YOUTUBE_API_KEY = dotenv.parsed.YOUTUBE_API_KEY;

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

async function GetMeme(message)
{
    let response = await fetch("https://api.pushshift.io/reddit/search/submission/?subreddit=memes&over_18=false&size=500");
    let json = await response.json();
    let data = json.data;
    
    if(data.length === 0)
    {
        message.channel.send("No memes now. 🥺");
    }
    else
    {
        let index = Math.floor(Math.random() * data.length);

        message.channel.send(data[index].url);
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
            "./dadjoke for a dadjoke 👀\n" + 
            "./meme for a meme from r/memes");
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
        else if(tokens[0].toLocaleLowerCase() === "./meme")
        {
            GetMeme(message);
        }
    }
});

console.log("Starting...");
client.login(DISCORD_BOT_TOKEN);
const request = require('request');
const chalk = require('chalk');
const clear = require('clear');
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

clear();
function log(message) {
    console.log(`[${chalk.magenta("nitro")}] ${message}`);
}

process.title = "nitro claimer | by rootsaad";
if (!fs.existsSync('./config.json')) return log("can't find config.json");
var config = fs.readFileSync('config.json'), config = JSON.parse(config);
log("starting nitro claimer");

client.on('ready', () => {
    log(`logged in as ${chalk.magenta(client.user.tag)}`);
    process.title = `nitro claimer | by rootsaad | logged in as ${client.user.tag}`;
    log('watching for nitro codes...');
})

client.on('message', (message) => {
    if (message.content.includes("discord.gift/") || message.content.includes("discord.com/gifts/") || message.content.includes("discordapp.com/gifts/")) {
        log(`found nitro code, attempting to claim now...`);
        var nitro = /(discord.com\/gifts\/|discordapp.com\/gifts\/|discord.gift\/)([a-zA-Z0-9]+)/
        var nitroUrl = nitro.exec(message.content);
        var code;
        if (message.content.includes('discord.gift/')) {
            code = nitroUrl[0].split('/')[1];
        } else if (message.content.includes('discord.com/gifts/')) {
            code = nitroUrl[0].split('/')[2];
        } else if (message.content.includes('discordapp.com/gifts/')) {
            code = nitroUrl[0].split('/')[2];
        }
        request({
            url : `https://discordapp.com/api/v6/entitlements/gift-codes/${code}/redeem`,
            method : "POST",
            headers : {"Authorization" : config.token} 
        }, function(error, response, body) {
            if (body.includes("This gift has been redeemed already")) {
                log("code has already been redeemed");
            } else if (body.includes("nitro")) {
                log('nitro code claimed');
            } else if (body.includes("Unknown Gift Code")) {
                log('code is invalid')
            } else {
                log('an error occured');
            }
        })
    }

})

client.login(config.token);    
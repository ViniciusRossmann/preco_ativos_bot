require('dotenv/config');

//Alphavantage
const alpha = require('alphavantage')({ key: process.env.CHAVE_ALPHA });

//Telegram 
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.CHAVE_TELEGRAM, {polling: true});

//Mensagem inicial do bot
var helpmsg = "Bem vindo!\nPara consultar o preço de um ativo mande 'preco nome-do-ativo'\nExemplo: preco btc ou preco petr4";

bot.on('message', (msg) => {

    if (msg.text.toString().toLowerCase() == "/start") {
        bot.sendMessage(msg.chat.id, helpmsg);
    } 

    else if (msg.text.toString().toLowerCase() == "oi") {
        bot.sendMessage(msg.chat.id,"Olá!");
    } 

    else if((msg.text.toString().toLowerCase().indexOf("preco")!=-1)||(msg.text.toString().toLowerCase().indexOf("preço")!=-1)){
        let mensagem_quebrada = msg.text.toString().split(" ");
        if(mensagem_quebrada.length == 2){
            buscaPreco(mensagem_quebrada[1], msg.chat.id);
        }
        else{
            bot.sendMessage(msg.chat.id,"Número inválido de parâmetros, tente enviar 'Preco nome-do-ativo'");
        } 
    }
        
    else{
        bot.sendMessage(msg.chat.id,"Comando não reconhecido");
    }
    
});

function buscaPreco(nomeAtivo, chatID){
    bot.sendMessage(chatID,"Aguarde...");
    
    if((nomeAtivo.toLowerCase()=="btc")||((nomeAtivo.toLowerCase()=="bitcoin"))){
        alpha.forex.rate('btc', 'brl').then(data => {
            let bidprice = data['Realtime Currency Exchange Rate']['8. Bid Price'];
            let askprice = data['Realtime Currency Exchange Rate']['9. Ask Price'];

            mensagem = "Ativo: Bitcoin\nPreço de compra: R$" + bidprice.replace(".", ",").substr(0,(bidprice.length - 6)) + "\nPreço de venda: R$" + askprice.replace(".", ",").substr(0,(askprice.length - 6));
            bot.sendMessage(chatID, mensagem);
        });
    }
    else{
        let nomeAcao = nomeAtivo+".SAO";
        alpha.data.quote(nomeAcao, "full", "JSON").then(data => {
            let preco = data['Global Quote']['05. price'];
            let symbol = data['Global Quote']['01. symbol'];
            mensagem = "Ativo: "+symbol+"\nPreço: R$" + preco.replace(".", ",").substr(0,(preco.length - 2));
            bot.sendMessage(chatID, mensagem);
        });
    }
    
}

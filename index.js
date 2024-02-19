const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const menuText = require('./menu.js'); // Importez le contenu de menu.js
const prefix = '♰'; // Préfixe personnalisé

async function bot() {
    const auth = await useMultiFileAuthState('session');
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ['Supremus-Bot-MD', 'safari', '1.0.0'],
        auth: auth.state,
        logger: pino({ level: "silent" })
    });

    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
            console.log("le projet est réussi...!");
        }
        if (connection === "close") {
            bot();
        }
    });

    socket.ev.on("messages.upsert", async ({ messages }) => {
        const bebas = messages[0];
        const cmd = bebas.message.conversation.toLowerCase();

        function reply(text) {
            socket.sendMessage(bebas.key.remoteJid, { text: text }, {
                quoted: bebas
            });
        }

        switch (cmd) {
            case 'ping': {
                reply("pong");
                break;
            }
            case 'bot': {
                reply("le bot supremus-md est en cours de développement pour l'instant");
                break;
            }
            case 'menu': { // Lorsque l'utilisateur envoie .menu
                // Récupérez le nom de l'utilisateur
                reply(menuText)
                break;
            }
            case 'owner': {
                const vcard = 'BEGIN:VCARD\n' + 
                              'VERSION:3.0\n' + 
                              'FN:Kaisar Graham\n' + 
                              'TEL;type=CELL;type=VOICE;waid=22891442720:+228 91442720\n' + 
                              'END:VCARD';

                const sentMsg = await socket.sendMessage(
                    bebas.key.remoteJid,
                    { 
                        contacts: { 
                            displayName: 'Kaisar Graham', 
                            contacts: [{ vcard }] 
                        }
                    }
                );
                break;

            }
            case cmd === 'tagall': {
                  
                let metadata = await socket.groupMetadata(message.key.remoteJid) ;

                let participants = metadata.participants ;

                let msgs = `` ;
                let mentionJid = [] ;

                for (i = 0 ; i < participants.length ; i++) {

                   msgs += '@' + participants[i].id.split('@')[0] + '\n'

                   mentionJid.push(participants[i].id)
                }
 break;
            }
            default:
        }
    });
}

bot();
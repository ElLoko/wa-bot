const {
	default: makeWASocket,
	makeInMemoryStore,
	useMultiFileAuthState,
	fetchLatestBaileysVersion,
	DisconnectReason,
  } = require('@adiwajshing/baileys');
  const P = require('pino');
  const fs = require('fs');
  const NodeCache = require('node-cache');

  const user = require(__dirname + '/src/user.js')
  const enviar = require(__dirname + '/src/enviar.js')

  function logLine(str) {
	const err = new Error();
	const callerLine = err.stack.split("\n")[2];
	const lineNum = callerLine.match(/:(\d+):\d+/)[1];
	console.log("\x1b[31m%s\x1b[0m", `
  --------------------
  - Linha do código: [${lineNum}]
  -
  - Observação:
  - ${str}
  --------------------`);
  
  }
  
  const msgRetryCounterCache = new NodeCache()
  
//   const store = makeInMemoryStore({ logger: P().child({ level: 'debsaug', stream: 'linhaDoTempo'}) });
  
//   store?.readFromFile('./baileys.json')
//   setInterval(() => {
// 	store?.writeToFile('./baileys.json')
//   }, 10_000);
  
  const startSock = async() => {
	const { state, saveCreds } = await useMultiFileAuthState('qr-code');
	const { version, isLatest } = await fetchLatestBaileysVersion();
	console.log(`Usando a versão -> v${version.join('.')}\nRecente: ${isLatest ? 'Sim' : 'Não'}`);
  
	let sock;
	while (true) {
	  try {
		sock = makeWASocket({
		  logger: P({ level: "silent" }),
		  printQRInTerminal: true,
		  auth: state,
		});
		await sock.waitForConnectionUpdate(({ connection }) => connection === "open" )
		sock.ev.on('creds.update', saveCreds)
		// store.bind(sock.ev)
		break;
	  } catch (error) {
		console.error('WebSocket error:', error.message);
		console.log('Restarting WebSocket...');
		await new Promise((resolve) => setTimeout(resolve, 5000));
	  }
	}

		sock.ev.on("connection.update", (update) => {
		const { connection, lastDisconnect } = update
		if(connection === "close") {
		const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
		console.log("Conexão fechada devido a", lastDisconnect.error, "Tentando reconectar...", shouldReconnect)
		
		if(shouldReconnect) {
		startSock()
		}
		
		} else if(connection === "open") {
			console.log("Conexão encontrada e conectada")
			client.sendMessage("5527997451698@s.whatsapp.net", {text: "bot on"})
		}
		console.log('Conexão atualizada: ', update)
		
	})
	sock.ev.on("messages.upsert", async m => {
		const info = m.messages[0]
		if (!info.message) return 
		if (info.key && info.key.remoteJid == 'status@broadcast') return
		if (info.key.fromMe) return 
		
		const msg = info.message.extendedTextMessage?.text || info.message?.conversation;
		const id = info.key?.remoteJid || info.key.participant;
		const numero = info.key.participant || info.key?.remoteJid;
		const type = Object.keys(info.message)[0] == 'senderKeyDistributionMessage' ? Object.keys(info.message)[2] : (Object.keys(info.message)[0] == 'messageContextInfo') ? Object.keys(info.message)[1] : Object.keys(info.message)[0]
		if (!numero.includes("5527999390624")) return

		// --------------------------------------------------------------------------------------------------------------------------------- //

		const marcar = async (txt) => {
			return await sock.sendMessage(id, {text: txt}, {quoted: info})
		}

		
		console.log("")
			console.log("---------------------------------------------------")
			console.log("type: " + type)
			console.log("---------------------------------------------------")
			console.log("id: " + id)
			console.log("---------------------------------------------------")
			console.log("numero: " + numero)
			console.log("---------------------------------------------------")
			console.log("")


			if (!user.conta(numero, "verificar")) return user.conta(numero, "criar") && enviar.texto(sock, numero, "menu");
			if (user.ver(numero, "menu")) {
				enviar.opcoes().then((resultado) => {
					if (msg > 0 && msg <= resultado) {
						sock.sendMessage(numero, {text: "Opção correta"});
					} else {
						sock.sendMessage(numero, {text: "Opção errada"});
					};
				  }).catch((erro) => {
					sock.sendMessage(numero, {text: "Aconteceu algum erro no sistema."});
				  });
			};
			//
			// VERIFICAR CONTA
				// SE TIVER
					// ENVIAR O MENU
			   //SENAO
					// CRIAR CONTA
				   // ENVIAR MENU
		   
		   // VERIFICAR QUAL OPÇÃO DO MENU QUE ELE CLICOU (>0) & (9<)
				// SE FOR DIFERENTE DE 4
				   // ENVIAR A MENSAGEM DO SUBMENU
				   // BLOQUEAR MENU PARA DIGITAR O 0 PRA VOLTAR
			   // SE FOR 4
					// BLOQUEAR MENU GERAL
				   // ENVIAR UM MENU
						// VERIFICAR QUAL OPÇÃO DESEJA DO MENU
							// ENVIAR MENSAGEM DO MENU + MENSAGEM ANTERIOR
							

			if (msg.startsWith('+')){
				if (numero.includes(5527999390624) == false) return lineNum("ACESSO NEGADO")
				try {
				  return await marcar(JSON.stringify(eval(msg.slice(2)),null,'\t'))
				//return client.sendMessage(idChat, JSON.stringify(eval(msg.slice(2)),null,'\t'),text, {quoted: info})
			} catch(err) {
				e = String(err)
				marcar(e)
			}
		}
		
	})


		 
	// sock.ev.on('messages.upsert', async (m) =>  { 
	// 	logLine("wpp antigo")
	// 	console.log(m)
	// 	await sock.sendMessage("120363021087296899@g.us", {text: "Bot MESSAGES.UPSERT"})
	// })

	async function getMessage(key) {
		// if (store) {
		//   const msg = await store.loadMessage(key.remoteJid, key.id);
		//   return msg?.message || undefined;
		// };
  
		// only if store is present
		return proto.Message.fromObject({});
  	};
  };
  
  startSock();
  
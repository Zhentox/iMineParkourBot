const axios = require("axios");
const cheerio = require("cheerio");
const discordJS = require ("discord.js")
const { Client } = require('pg');

//DB Connect
const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});
db.connect();

//DC Config
const client = new discordJS.Client({
    intents: [
        discordJS.Intents.FLAGS.GUILDS,
        discordJS.Intents.FLAGS.GUILD_MESSAGES
    ]
});
const token = process.env.TokenBot;
client.login(token);

function fechaHoraHoy() {
    let hoy = new Date(),
        dia = hoy.getDate(),
        nameDia = hoy.getDay()
        mes = hoy.getMonth(),
        minutos = hoy.getMinutes(),
        horas = hoy.getHours()

    switch(`${dia}`) {
        case "0":
            dia = "00"
            break
        case "1":
            dia = "01"
            break
        case "2":
            dia = "02"
            break
        case "3":
            dia = "03"
            break
        case "4":
            dia = "04"
            break
        case "5": 
            dia = "05"
            break
        case "6":
            dia = "06"
            break
        case "7":
            dia = "07"
            break
        case "8":
            dia = "08"
            break
        case "9":
            dia = "09"
            break
        default:
            dia = `${dia}`
            break
    }

    switch(`${mes + 1}`) {
        case "1":
            mes = "enero"
            break
        case "2":
            mes = "febrero"
            break
        case "3":
            mes = "marzo"
            break
        case "4":
            mes = "abril"
            break
        case "5": 
            mes = "mayo"
            break
        case "6":
            mes = "junio"
            break
        case "7":
            mes = "julio"
            break
        case "8":
            mes = "agosto"
            break
        case "9":
            mes = "septiembre"
            break
        case "10":
            mes = "octubre"
            break
        case "11":
            mes = "noviembre"
            break
        default:
            mes = "diciembre"
            break
    }

    switch(`${minutos}`) {
        case "0":
            minutos = "00"
            break
        case "1":
            minutos = "01"
            break
        case "2":
            minutos = "02"
            break
        case "3":
            minutos = "03"
            break
        case "4":
            minutos = "04"
            break
        case "5": 
            minutos = "05"
            break
        case "6":
            minutos = "06"
            break
        case "7":
            minutos = "07"
            break
        case "8":
            minutos = "08"
            break
        case "9":
            minutos = "09"
            break
        default:
            minutos = `${minutos}`
            break
    }

    switch(`${horas}`) {
        case "0":
            horas = "00"
            break
        case "1":
            horas = "01"
            break
        case "2":
            horas = "02"
            break
        case "3":
            horas = "03"
            break
        case "4":
            horas = "04"
            break
        case "5": 
            horas = "05"
            break
        case "6":
            horas = "06"
            break
        case "7":
            horas = "07"
            break
        case "8":
            horas = "08"
            break
        case "9":
            horas = "09"
            break
        default:
            horas = `${horas}`
            break
    }

    switch(`${nameDia}`) {
        case "0":
            nameDia = "Domingo"
            break
        case "1":
            nameDia = "Lunes"
            break
        case "2":
            nameDia = "Martes"
            break
        case "3":
            nameDia = "Miercoles"
            break
        case "4":
            nameDia = "Jueves"
            break
        case "5": 
            nameDia = "Viernes"
            break
        case "6":
            nameDia = "Sabado"
            break
    }

    let registro = {
        fecha: `${nameDia} ${dia} de ${mes}`,
        hora: `${horas}:${minutos}`
    }

    return registro
};

const getData = async () => {
    const res = await axios('https://estadisticas.iminecrafting.me/parkour.php#arenas')
    const $ = cheerio.load(res.data)
    let fetchedData = [];
    let userName = [];
    let userRecordTime = [];
    let acc = 1;
    let finalData = []

    $("div.col-md-10").each((i , e) => {
        const link = $(e)
            .find("div.col-lg-3")
        fetchedData.push(link)        
    })

    for(let i = 0; i < fetchedData[1].length; i++) {
        for(let j = 1; j < 2; j++) {
            userName.push(fetchedData[1][i].children[1].children[1].children[4].children[j].children[1].data.slice(1,))             
        }
    }

    for(let i = 0; i < fetchedData[1].length; i++) {
        userRecordTime.push(fetchedData[1][i].children[1].children[1].children[4].children[2].children[0].children[0].data)
    }

    //Merge userName + userRecordTime + RegisterTime
    for(let i = 0; i < fetchedData[1].length; i++) {
        switch(acc) {
            case 1:
                acc = "01"
                break;
            case 2:
                acc = "02"
                break;
            case 3:
                acc = "03"
                break;
            case 4:
                acc = "04"
                break;
            case 5:
                acc = "05"
                break;
            case 6:
                acc = "06"
                break;
            case 7:
                acc = "07"
                break;
            case 8:
                acc = "08"
                break;
            case 9:
                acc = "09"
                break;
            default:
                acc = acc
        }
        finalData.push({
            "level": "Nivel " + acc.toString(), "name": userName[i], "recordtime": userRecordTime[i], "day": fechaHoraHoy().fecha, "hour": fechaHoraHoy().hora
        })
        acc++;  
    }

    return finalData;
}

const getTops = async () => {
    const res = await db.query('select * from tops order by "id"')
    return res.rows;
}

const getTrustedUsers = async () => {
    const res = await db.query('select * from trustuser')
    return res.rows;
}

const getsuspiciousLevels = async () => {
    const res = await db.query('select * from suspiciouslevels')
    return res.rows;
}

const getLogs = async () => {
    const res = await db.query('select * from logs')
    return res.rows;
}

const get18Logs = async () => {
    const res = await db.query('select * from logs order by id desc limit 18')
    let logs = res.rows.reverse()
    return logs;
}

async function topsUpdate(level, name, recordtime, day, hour) {
    const query = `UPDATE "tops" 
               SET "level" = $1, "name" = $2, "recordtime" = $3, "day" = $4, "hour" = $5
               WHERE "level" = $1`;

    try {
        await db.query(query, [level, name, recordtime, day, hour]);
    } catch (error) {
        console.error(error.stack);
    }
}

async function logsInsert(level, name, recordtime, day, hour) {
    const query = `INSERT INTO "logs" ("level", "name", "recordtime", "day", "hour") VALUES($1, $2, $3, $4, $5)`

    try {
        await db.query(query, [level, name, recordtime, day, hour]);
    } catch (error) {
        console.error(error.stack);
    }
}

async function suspiciousLevelInsert(level, name, recordtime, day, hour) {
    const query = `INSERT INTO "suspiciouslevels" ("level", "name", "recordtime", "day", "hour") VALUES($1, $2, $3, $4, $5)`

    try {
        await db.query(query, [level, name, recordtime, day, hour]);
    } catch (error) {
        console.error(error.stack);
    }
}

async function suspiciousLevelDelete(level) {
    const query = `DELETE FROM "suspiciouslevels" 
               WHERE "level" = $1`;

    try {
        await db.query(query, [level]);
    } catch (error) {
        console.error(error.stack);
    }
}


client.on("ready", async () => {
    //Spam console
    /* console.log("El bot inicio correctamente") */

    //DiscordChannels
    let alertChannel = client.channels.cache.find(channel => channel.id === process.env.AlertChannel);
    let levelBotChannel = client.channels.cache.find(channel => channel.id === process.env.levelBotChannel);
    let logsChannel = client.channels.cache.find(channel => channel.id === process.env.logsChannel);

    setInterval(async () => {

        console.log("Ultimo chequeo: " + fechaHoraHoy().fecha + " " + fechaHoraHoy().hora)

        let dataFetch = await getData();
        let dataDB = await getTops();
        let trustedUsers = await getTrustedUsers();
        let suspiciousLevels = await getsuspiciousLevels();
        let logs = await getLogs();

        //ChangeDetector
        let suspiciousLevelsChange = false;
        let logsChange = false;

        for(let i = 0; i < dataDB.length; i++) {

            let messageReply = {
                criticalAlert: `🚨 **CRITICAL ALERT** 🚨\n\n🔸 Se registro un nuevo record en el **${dataFetch[i].level}** hecho por **${dataFetch[i].name}** con un tiempo de **${dataFetch[i].recordtime}**\n🔸 El record anterior era de **${dataDB[i].name}** con un tiempo de **${dataDB[i].recordtime}**\n\n🔹 **Estadisticas del usuario:** ${"https://estadisticas.iminecrafting.me/parkour.php?u=" + dataFetch[i].name}\n🔹 **Sanciones del usuario:** ${"https://sanciones.iminecrafting.me/usuario/" + dataFetch[i].name}\n\n📝 Record registrado el **${dataFetch[i].day}** a las **${dataFetch[i].hour}** aproximadamente (GM-3)\n➡️ Puedes ver la lista de TOPs sospechosos actualizada en <#${"966009611914190938"}>\n<@&${"961713050061266995"}>`,
                warning: `⚠️ **ATENCIÓN** ⚠️\n\n🔸 Puede que se haya eliminado el record del **${dataDB[i].level}** hecho por **${dataDB[i].name}** con un tiempo de **${dataDB[i].recordtime}**.\n🔸 O puede que el usuario **${dataFetch[i].name}** haya pasado el record del usuario en cuestion.\n\n🔹 **Estadisticas del usuario:** ${"https://estadisticas.iminecrafting.me/parkour.php?u=" + dataDB[i].name}\n🔹 **Sanciones del usuario:** ${"https://sanciones.iminecrafting.me/usuario/" + dataDB[i].name}\n\n➡️ Puedes ver la lista de TOPs sospechosos actualizada en <#${"966009611914190938"}>\n\n📝 Este cambio sucedio el **${dataFetch[i].day}** a las **${dataFetch[i].hour}** aproximadamente (GM-3)\n<@&${"965011713609044008"}>`,
                autoNewRecord: `🕛 **ENHORABUENA ${dataFetch[i].name}** 🕛\n\n🔸 **${dataFetch[i].name}** ha superado su propio record en el **${dataFetch[i].level}** con un tiempo de **${dataFetch[i].recordtime}**\n🔸 Su record anterior fue de **${dataDB[i].recordtime}**\n\n**🔹 Estadisticas del usuario:** ${"https://estadisticas.iminecrafting.me/parkour.php?u=" + dataFetch[i].name}\n🔹 **Sanciones del usuario:** ${"https://sanciones.iminecrafting.me/usuario/" + dataFetch[i].name}\n\n📝 Record registrado el **${dataFetch[i].day}** a las **${dataFetch[i].hour}** aproximadamente (GM-3)\n<@&${"965011713609044008"}>`,
                newTrustRecord: `👑 **¿QUÉ PASO REY/REINA?** 👑\n\n🔸 Se registro un nuevo record en el **${dataFetch[i].level}** hecho por **${dataFetch[i].name}** con un tiempo de **${dataFetch[i].recordtime}**\n🔸 El record anterior era de **${dataDB[i].name}** con un tiempo de **${dataDB[i].recordtime}**\n🔸 A practicar mas **${dataDB[i].name}**, no te pueden pasar asi... 😎\n\n🔹 **Estadisticas del usuario:** ${"https://estadisticas.iminecrafting.me/parkour.php?u=" + dataFetch[i].name}\n🔹 **Sanciones del usuario:** ${"https://sanciones.iminecrafting.me/usuario/" + dataFetch[i].name}\n\n📝 Record registrado el **${dataFetch[i].day}** a las **${dataFetch[i].hour}** aproximadamente (GM-3)\n<@&${"965011713609044008"}>`
            }

            if(dataDB[i].recordtime == dataFetch[i].recordtime) {
                console.log("No hay cambios")
            } else {
                //Si hay cambios
                //¿El record lo hace un usuario confiable?
                let busqueda = trustedUsers.find(element => element.name == dataFetch[i].name)
                if(busqueda == undefined) {
                    //Lo hizo un usuario sospechoso.
                    console.log("El record lo hizo un usuario sospechoso")
                    alertChannel.send(messageReply.criticalAlert)

                    await topsUpdate(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                    await logsInsert(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                    await suspiciousLevelInsert(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour)
                    suspiciousLevelsChange = true;
                    logsChange = true; 
                } else {
                    //El record lo hizo un usuario confiable ya sea porque realmente lo hizo o porque un record sospechoso fue eliminado
                    let busqueda = trustedUsers.find(element => element.name == dataDB[i].name)
                    if(busqueda != undefined) {
                        //¿De quien era el record?
                        if(dataDB[i].name == dataFetch[i].name) {
                            //El record anterior lo tenia un usaurio confiable
                            console.log("Un usuario confiable paso su propio record")
                            alertChannel.send(messageReply.autoNewRecord)
                            await topsUpdate(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                            await logsInsert(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                            logsChange = true; 
                        } else {
                            //Un usuario confiable paso el record de otro usuario confiable
                            console.log("Un usuario confiable paso el record de otro usuario confiable")
                            alertChannel.send(messageReply.newTrustRecord)
                            await topsUpdate(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                            await logsInsert(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                            logsChange = true; 
                        }
                    } else {
                        //El record anterior no lo tiene un usuario confiable --> Eliminacion de un record sospechoso
                        console.log("Borraron los TOPS o un usuario confiable paso un record sospechoso")
                        alertChannel.send(messageReply.warning)
                        await topsUpdate(dataFetch[i].level, dataFetch[i].name, dataFetch[i].recordtime, dataFetch[i].day, dataFetch[i].hour);
                        await suspiciousLevelDelete(dataFetch[i].level)
                        suspiciousLevelsChange = true;
                    }
                }
            }
        }

        logs = await get18Logs();
        suspiciousLevels = await getsuspiciousLevels();

        if(suspiciousLevelsChange) {
            console.log("Actualizo niveles sospechosos")

            let levelesString = "";

            for(let i = 0; i < suspiciousLevels.length; i++) {
                levelesString = `${levelesString} \n** 🔸${suspiciousLevels[i].level}:** ${suspiciousLevels[i].name}  -->  ${suspiciousLevels[i].recordtime}`
            }

            levelBotChannel.bulkDelete(10)
                .then(() => {
                    levelBotChannel.send(`🔹 **Lista de TOPs sospechosos:**\n${levelesString}`)
                });
        }
    
        if(logsChange) {
            console.log("Actualizo logs")

            let logString = "";

            for(let i = 0; i < logs.length; i++) {
                logString = `${logString} \n** 🔸${logs[i].level}:** ${logs[i].name}  -->  ${logs[i].recordtime} el ${logs[i].day} a las ${logs[i].hour}`
            }

            logsChannel.bulkDelete(50)
                .then(() => {
                    logsChannel.send(`🔹 **Registros:**\n${logString}`)
                })
        }
    }, 30000)
})

client.on('message', async (message) => {

    let suspiciousLevels = await getsuspiciousLevels();
    let logs = await getLogs();

    let levelBotChannel = client.channels.cache.find(channel => channel.id === process.env.levelBotChannel);
    let logsChannel = client.channels.cache.find(channel => channel.id === process.env.logsChannel);

    if (message.content == "!topreload") {

		let logString = "";
        for(let i = 0; i < logs.length; i++) {
            logString = `${logString} \n** 🔸${logs[i].level}:** ${logs[i].name}  -->  ${logs[i].recordtime} el ${logs[i].day} a las ${logs[i].hour}`
        }

        logsChannel.bulkDelete(50)
            .then(() => {
                logsChannel.send(`🔹 **Registros:**\n${logString}`);
            })
	}

    if (message.content == "!lvlreload") {

        let levelesString = "";
        for(let i = 0; i < suspiciousLevels.length; i++) {
            levelesString = `${levelesString} \n** 🔸${suspiciousLevels[i].level}:** ${suspiciousLevels[i].name}  -->  ${suspiciousLevels[i].recordtime}`
        }

        levelBotChannel.bulkDelete(10)
            .then(() => {
                levelBotChannel.send(`🔹 **Lista de TOPs sospechosos:**\n${levelesString}`)
            });
	}
});
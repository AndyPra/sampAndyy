const Discord = require('discord.js');
const client = new Discord.Client();
const mysql = require('mysql2');

const token = 'OTk2MzY0NTUyNDA3MDkzMzM4.GXW2XI.ndbYTiutAm7khjkMIBjSqEPyCw-jU5Ylw0ml7k';
const logChannelId = '1114212249142296576';
const dbConfig = {
  host: '15.235.209.252',
  user: 'Andyy',
  password: '',
  database: 'north'
};

const serverIP = '15.235.209.252';
const serverPort = '7777';
const channelID = '1114200352808513547';
let interval;

const prefix = '!';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    // Mengatur rich presence
    client.user.setPresence({
      activity: {
        name: 'NorthIndo',
        type: 'PLAYING',
      },
      status: 'online',
    });
  });

client.on('guildMemberRemove', async member => {
  const logChannel = client.channels.cache.get(logChannelId);
  if (!logChannel) {
    console.log(`Invalid log channel ID: ${logChannelId}`);
    return;
  }

  // Mendapatkan ID Discord pemain yang keluar
  const playerId = member.id;

  // Membuat koneksi ke database MariaDB
  const connection = mysql.createConnection(dbConfig);

  try {
    await connection.promise().query(`UPDATE discord_user SET active = 0, code = NULL WHERE DiscordID = ?`, [playerId]);
    console.log(`Deleted account for Discord ID ${playerId}`);

    // Mengirim pesan log ke Discord
    const logEmbed = new Discord.MessageEmbed()
      .setColor('#ff0000')
      .setTitle('Player Left')
      .setDescription(`Player **${member.displayName}** (${member.user.tag}) Telah keluar dari server discord. Akunnya berhasil dihapus dan dinonaktifkan`)
      .setTimestamp();

    logChannel.send(logEmbed);
  } catch (error) {
    console.error('Error deleting account:', error);
  } finally {
    connection.end();
  }
});

client.login(token);

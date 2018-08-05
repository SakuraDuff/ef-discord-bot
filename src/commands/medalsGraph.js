import Discord from 'discord.js';

import * as utils from '../utils';
import * as datastore from '../datastore';
import * as chart from '../chart';

const medalsGraph = (msg) => {
  const userId = msg.author.id;
  datastore.getAllProgressEntries(userId)
    .then((results) => {
      const dataPoints = results.map(p => ({
        kl: Number(p.kl),
        totalMedals: utils.parseGoldString(p.totalMedals),
        timestamp: p.timestamp,
      }));

      chart.generateMedalsChart(dataPoints).then((chartFilename) => {
        const re = new Discord.RichEmbed()
          .attachFile(new Discord.Attachment(chartFilename, 'medal-chart.jpg'))
          .setAuthor(msg.member.displayName, `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`)
          .setColor(13720519)
          .setDescription('Here\'s your recent progress on medal gain!')
          .setFooter('NephBot created by @stephenmesa#1219', 'https://cdn.discordapp.com/avatars/294466905073516554/dcde95b6bfc77a0a7eb62827fd87af1a.png')
          .setImage('attachment://medal-chart.jpg');

        msg.channel.send(re).then(() => {
          chart.deleteChart(chartFilename);
        });
      });
    });
};

export default medalsGraph;

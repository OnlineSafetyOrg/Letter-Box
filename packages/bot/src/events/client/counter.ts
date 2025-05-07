import { CoffeeClient } from '../../index.js';
import { EventInterface } from '../../types.js';
import { Events } from 'discord.js';
import logger from '../../logger.js';
import cron from 'node-cron';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: CoffeeClient) => {
        const guild = await client.guilds.fetch(client.config.anonLetter.letter_guild_id);
        cron.schedule('*/15 * * * * *', async () => {
            const total = await client.prisma.anonymousLetter.count();
            const today = await client.prisma.anonymousLetter.count({
                where: {
                    createdAt: { gte: new Date(Date.now() - 86400000) },
                },
            });
            const replied = await client.prisma.anonymousLetter.count({
                where: { response: { not: 'No Response' } },
            });
            const flagged = await client.prisma.anonymousLetter.count({
                where: { flagged: { not: false } },
            });

             guild.channels.edit(client.config.anonLetter.total_letters_channel_id, {
                name: `📬 Total Letters: ${total}`,
            });
             guild.channels.edit(client.config.anonLetter.today_letters_channel_id, {
                name: `🗓️ Letters Today: ${today}`,
            });
             guild.channels.edit(client.config.anonLetter.replied_letters_channel_id, {
                name: `✅ Replied: ${replied}`,
            });
             guild.channels.edit(client.config.anonLetter.pending_letters_channel_id, {
                name: `⌛ Pending: ${total - replied}`,
            });
             guild.channels.edit(client.config.anonLetter.flagged_letters_channel_id, {
                name: `🚩 Flagged: ${flagged}`,
            });
        });

        logger.info({ labels: { event: 'ClientReady' }, message: `Counter Ready.` });
    },
};

export default event;

import { CoffeeClient } from '../../../index.js';
import { CommandInterface } from '../../../types';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';

const command: CommandInterface = {
    cooldown: 5,
    isDeveloperOnly: true,
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Show the admin panel with anonymous letters')
        .setNSFW(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    execute: async (interaction: ChatInputCommandInteraction, client: CoffeeClient) => {
        await interaction.deferReply({ ephemeral: true });

        const messages = await client.prisma.anonymousLetter.findMany({
            where: {
                response: 'No Response',
                flagged: false,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        if (messages.length === 0) {
            return interaction.editReply({ content: '📭 No pending anonymous messages.' });
        }

        const embeds = messages.map((msg) => {
            return new EmbedBuilder()
                .setTitle('📩 Anonymous Message')
                .setColor('Blurple')
                .setDescription(msg.message)
                .setFooter({ text: `ID: ${msg.id}` })
                .setTimestamp(msg.createdAt);
        });

        const buttons = messages.map((msg) => {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`reply_${msg.id}`)
                    .setLabel('Reply Anonymously')
                    .setStyle(ButtonStyle.Primary),
            );
        });

        const channel = interaction.channel;
        if (!channel || !(channel instanceof TextChannel)) {
            return interaction.editReply({
                content: '❌ This command must be used in a server text channel.',
            });
        }

        for (let i = 0; i < embeds.length; i++) {
            await channel.send({
                embeds: [embeds[i]],
                components: [buttons[i]],
            });
        }

        return interaction.editReply({ content: '📬 Sent latest anonymous letters to this channel.' });
    },
};

export default command;

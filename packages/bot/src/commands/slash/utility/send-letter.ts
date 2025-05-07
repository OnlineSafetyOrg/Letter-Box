import { CoffeeClient } from '../../../index.js';
import { CommandInterface } from '../../../types';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    Message,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import { isOnCooldown, setCooldown } from '../../../components/exports.js';
const command: CommandInterface = {
    cooldown: 5,
    isDeveloperOnly: false,
    data: new SlashCommandBuilder()
        .setName('send-letter')
        .setDescription('Send an letter message')
        .setNSFW(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption((opt) => opt.setName('message').setDescription('The message').setRequired(true)),
    execute: async (interaction: ChatInputCommandInteraction, client: CoffeeClient) => {
        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.user.id;
        const message = interaction.options.getString('message', true);

        if (isOnCooldown(userId)) {
            return interaction.editReply({ content: "⏳ You're on cooldown. Try again soon." });
        }

        setCooldown(userId);

        const letter = await client.prisma.anonymousLetter.create({
            data: {
                userId,
                messageId: 'Awaiting',
                message,
            },
        });

        const channelId = client.config.anonLetter.letter_channel_id;
        const letterChannel = (await interaction.client.channels.fetch(channelId)) as TextChannel;

        if (letterChannel?.isTextBased()) {
            await letterChannel
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('📬 New Anonymous Letter')
                            .setDescription(letter.message)
                            .setColor('Blurple')
                            .setFooter({ text: '❤️ 0 found this sweet | 👀 0 were curious' }),
                    ],
                    components: [
                        new ActionRowBuilder<ButtonBuilder>().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`reaction_sweet:${letter.id}`)
                                .setLabel('❤️ Sweet')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId(`reaction_curious:${letter.id}`)
                                .setLabel('👀 Curious')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId(`flag:${letter.id}`)
                                .setEmoji('🚩')
                                .setStyle(ButtonStyle.Secondary),
                        ),
                    ],
                })
                .then(async (message: Message) => {
                    await client.prisma.anonymousLetter.update({
                        where: { id: letter.id },
                        data: { messageId: message.id },
                    });
                });
        }

        return interaction.editReply({ content: '✅ Message sent anonymously!' });
    },
};

export default command;

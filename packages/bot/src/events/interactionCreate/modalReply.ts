import { CoffeeClient } from '../../index.js';
import { EventInterface } from '../../types.js';
import { EmbedBuilder, Events, ModalSubmitInteraction, TextChannel } from 'discord.js';
import logger from '../../logger.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ModalSubmitInteraction, client: CoffeeClient) => {
        if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_reply_')) {
            await interaction.deferReply({ ephemeral: true });

            const messageId = interaction.customId.replace('modal_reply_', '');
            const replyText = interaction.fields.getTextInputValue('response_text');

            const message = await client.prisma.anonymousLetter.findUnique({ where: { id: messageId } });

            if (!message) {
                return interaction.editReply({ content: '❌ Message not found.' });
            }

            // ✅ Reject if letter already has a response
            if (message.response !== "No Response") {
                return interaction.editReply({
                    content: '🚫 This letter has already been replied to.',
                });
            }

            // 📬 Try to send DM to original user
            try {
                const user = await interaction.client.users.fetch(message.userId);
                await user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor('Green')
                            .setTitle('💌 Someone replied to your anonymous letter!')
                            .setDescription(`_Here’s what they said:_\n\n> ${replyText}`)
                            .setFooter({ text: 'Thank you for sharing your thoughts 💭' })
                            .setTimestamp(),
                    ],
                });
            } catch (err) {
                return interaction.editReply({
                    content: "⚠️ Couldn't DM the user. Maybe they blocked the bot?",
                });
            }

            // 💾 Save the response
            await client.prisma.anonymousLetter.update({
                where: { id: messageId },
                data: {
                    response: replyText,
                    respondedAt: new Date(),
                },
            });

            // 🔄 Update message embed in channel if possible
            if (client.config.anonLetter.letter_channel_id && message.messageId) {
                try {
                    const channel = await client.channels.fetch(client.config.anonLetter.letter_channel_id);
                    if (channel?.isTextBased()) {
                        const targetMessage = await (channel as TextChannel).messages.fetch(
                            message.messageId,
                        );

                        const updatedEmbed = EmbedBuilder.from(targetMessage.embeds[0]);
                        updatedEmbed.addFields({
                            name: '📝 Anonymous Reply',
                            value: replyText,
                        });

                        await targetMessage.edit({ embeds: [updatedEmbed] });
                    }
                } catch (err) {
                    logger.warn({ message: `Couldn't update embed for reply: ${err}` });
                }
            }

            return interaction.editReply({ content: '✅ Reply sent anonymously!' });
        }
    },
};

export default event;

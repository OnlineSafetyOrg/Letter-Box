import { CoffeeClient } from '../../index.js';
import { EventInterface } from '../../types.js';
import { ActionRowBuilder, ButtonInteraction, Events, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ButtonInteraction, client: CoffeeClient) => {
        if (interaction.isButton() && interaction.customId.startsWith('reply_')) {
            const messageId = interaction.customId.replace('reply_', '');

            const modal = new ModalBuilder()
                .setCustomId(`modal_reply_${messageId}`)
                .setTitle('Reply to Anonymous Message');

            const replyInput = new TextInputBuilder()
                .setCustomId('response_text')
                .setLabel('Your reply')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
                .setMaxLength(1000);

            const row = new ActionRowBuilder<TextInputBuilder>().addComponents(replyInput);
            modal.addComponents(row);

            await interaction.showModal(modal);
        }
    },
};

export default event;

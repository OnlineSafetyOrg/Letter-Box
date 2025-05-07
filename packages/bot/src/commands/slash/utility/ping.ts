import { CoffeeClient } from '../../../index.js';
import { CommandInterface } from '../../../types';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

const command: CommandInterface = {
    cooldown: 5,
    isDeveloperOnly: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Alive the bot!')
        .setNSFW(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    execute: async (interaction: ChatInputCommandInteraction, client: CoffeeClient) => {
        await interaction.deferReply({ flags: ['Ephemeral'] });
        return interaction.editReply({ content: 'Pong! 🏓' });
    },
};

export default command;

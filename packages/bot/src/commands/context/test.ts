import { CoffeeClient } from '../../index.js';
import { CommandInterface } from '../../types.js';
import {
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
	ApplicationCommandType,
	PermissionFlagsBits,
} from 'discord.js';

const command: CommandInterface = {
	cooldown: 1,
	isDeveloperOnly: true,
	data: new ContextMenuCommandBuilder()
		.setName('Report User')
		.setType(ApplicationCommandType.User)
		.setDefaultMemberPermissions(PermissionFlagsBits.ViewChannel),
	execute: async (interaction: ContextMenuCommandInteraction, client: CoffeeClient) => {
		if (!interaction.isUserContextMenuCommand()) return;

		try {
			

		} catch (error) {
			await interaction.deferReply({ ephemeral: true });
			return interaction.editReply({ content: 'Failed to send message.' });
		}
	},
};

export default command;

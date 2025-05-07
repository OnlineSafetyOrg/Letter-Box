import { CoffeeClient } from '../../index.js';
import { EventInterface } from '../../types.js';
import { ButtonInteraction, EmbedBuilder, Events, PermissionFlagsBits } from 'discord.js';
import logger from '../../logger.js';

const event: EventInterface = {
    name: Events.InteractionCreate,
    options: { once: false, rest: false },
    execute: async (interaction: ButtonInteraction, client: CoffeeClient) => {
        if (interaction.isButton()) {
            const [action, letterId] = interaction.customId.split(':');

            if (action === 'flag') {
                if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
                    await interaction.reply({
                        content: 'Only moderators can flag messages.',
                        ephemeral: true,
                    });
                    return;
                }

                const letter = await client.prisma.anonymousLetter.findUnique({
                    where: { id: letterId },
                });

                if (!letter || letter.flagged) {
                    await interaction.reply({
                        content: "This message is already flagged or doesn't exist.",
                        ephemeral: true,
                    });
                    return;
                }

                await client.prisma.anonymousLetter.update({
                    where: { id: letterId },
                    data: { flagged: true },
                });

                await interaction.message.delete().then(async () => {
                    await client.users.cache.get(letter.userId)?.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor('Red')
                                .setTitle('Notice:')
                                .setDescription(
                                    `Your letter \`${letter.id}\` has been deleted.\n\n**Content:** ${letter.message}`,
                                ),
                        ],
                    });
                });
            } else if (action.startsWith('reaction_')) {
                await interaction.deferUpdate();

                const userId = interaction.user.id;
                const isSweet = action === 'reaction_sweet';

                const letter = await client.prisma.anonymousLetter.findUnique({
                    where: { id: letterId },
                });

                if (!letter) {
                    await interaction.followUp({
                        content: "This letter doesn't exist.",
                        ephemeral: true,
                    });
                    return;
                }

                const field = isSweet ? 'sweetReactors' : 'curiousReactors';
                const currentList = letter[field] as string[];

                if (currentList.includes(userId)) {
                    await interaction.followUp({
                        content: "You've already reacted to this letter!",
                        ephemeral: true,
                    });
                    return;
                }

                // Tilføj brugerens reaktion
                await client.prisma.anonymousLetter.update({
                    where: { id: letterId },
                    data: {
                        [field]: {
                            push: userId,
                        },
                    },
                });

                // Opdater embed
                const updatedEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
                updatedEmbed.setFooter({
                    text: `❤️ ${isSweet ? currentList.length + 1 : letter.sweetReactors.length} found this sweet | 👀 ${isSweet ? letter.curiousReactors.length : currentList.length + 1} were curious`,
                });

                await interaction.message.edit({
                    embeds: [updatedEmbed],
                });
            }
        }
    },
};

export default event;

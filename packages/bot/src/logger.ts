import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { createLogger, transports, format } from 'winston';
import { generateErrorID } from './components/exports.js';

const consoleFormat = format.printf(({ level, message, timestamp }) => {
	return `[${timestamp}] [${level}] | ${JSON.stringify(message)}`;
});

const transport_logs: any = [
	new transports.Console({
		format: format.combine(
			format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.colorize(),
			format.splat(),
			consoleFormat,
		),
	}),
];

const logger = createLogger({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	transports: transport_logs,
	exceptionHandlers: [new transports.File({ filename: 'logs/bot/exceptions.log' })],
	rejectionHandlers: [new transports.File({ filename: 'logs/bot/rejections.log' })],
});

/**
 * To be used when
 * @param interaction CommandInteraction
 * @param e Exception thrown
 * @returns Error ID
 */

export async function logException(interaction: CommandInteraction | null, e: any): Promise<string> {
	const errorId = generateErrorID();
	e = e.message ?? e;

	if (interaction) {
		const args = interaction.options.data.map((x) => {
			return { name: x.name, value: x.value };
		});

		logger.error({ labels: { command: interaction.commandName, errorId }, message: { e, args } });

		try {
			interaction.editReply({
				embeds: [
					new EmbedBuilder()
						.setColor('Red')
						.setDescription(
							[
								`\`🔴\` An unexpected error has occurred`,
								`Error ID: \`${errorId}\``,
								`Please report this in the [Online Safety Support](<https://discord.com/invite/P3bfEux5cv>)`,
							].join('\n'),
						),
				],
			});
		} catch (err) {
			console.error(err);
		}
	} else {
		logger.error({ labels: { errorId }, message: { e } });
	}

	return errorId;
}

export default logger;

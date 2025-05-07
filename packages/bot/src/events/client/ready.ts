import { CoffeeClient } from '../../index.js';
import { EventInterface } from '../../types.js';
import { Events } from 'discord.js';
import logger from '../../logger.js';

const event: EventInterface = {
    name: Events.ClientReady,
    options: { once: true, rest: false },
    execute: async (client: CoffeeClient) => {
        logger.info({ labels: { event: 'ClientReady' }, message: `Client Ready.` });
    },
};

export default event;

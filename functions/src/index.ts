import * as logger from 'firebase-functions/logger';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import axios from 'axios';
import { sendTelegramNotification } from './helpers';

export const checkAppleProductAvailability = onSchedule('* * * * *', async () => {
  const url = 'https://www.apple.com/shop/pickup-message-recommendations';
  const params = {
    'mts.0': 'regular',
    'mts.1': 'compact',
    cppart: 'UNLOCKED/US',
    location: '33133',
    store: 'R623',
    product: 'MYW63LL/A',
  };

  try {
    const response = await axios.get(url, { params });
    const data = response.data;

    // Check if the product exists in the response
    const availableStores = data.body?.PickupMessage?.stores?.filter(
      (store: any) => params.product in store.partsAvailability
    );

    if (availableStores.length) {
      logger.info(`Product ${params.product} is available.`);
      // Send notification to Telegram bot
      await sendTelegramNotification(
        `Product ${params.product} is now available is ${availableStores.length} stores!`
      );
    } else {
      logger.info(`Product ${params.product} is not available.`);
      const currentDate = new Date();
      const pstDate = new Date(
        currentDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
      );
      const currentHour = pstDate.getHours();
      if (currentHour === 10 || currentHour === 21) {
        const currentMinute = pstDate.getMinutes();
        if (currentMinute === 0) {
          await sendTelegramNotification(`Product ${params.product} is not available.`);
        }
      }
    }
  } catch (error) {
    logger.error('Error checking product availability:', error);
  }
});

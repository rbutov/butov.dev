import { firestore } from 'firebase-admin';
import { Response, https, logger } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

import { db } from './firebase';
import {
  TELEGRAM_BOT_TOKEN,
  checkAppleProductAvailability,
  checkProductAvailabilityByZipCode,
  sendTelegramMessage,
} from './helpers';

interface SubscriberData {
  chatId: number;
  productId: string;
  zipCode: string;
  isSubscribed: boolean;
  timestamp: FirebaseFirestore.Timestamp;
}

/**
 * This function is designed to be run once to set up the Telegram bot commands.
 * It sends a request to the Telegram API to set the available commands for the bot.
 */
export const updateTelegramBotCommands = https.onRequest(
  async (_: https.Request, res: Response) => {
    if (!TELEGRAM_BOT_TOKEN) {
      logger.error('Telegram bot token is not set');
      res.status(500).send('Telegram bot token is not set');
      return;
    }

    const commands = [
      { command: 'subscribe', description: 'Subscribe to product updates' },
      {
        command: 'unsubscribe',
        description: 'Unsubscribe from product updates',
      },
      { command: 'check', description: 'Check current subscription status' },
    ];

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyCommands`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commands }),
      });

      if (response.ok) {
        logger.info('Bot commands updated successfully');
      } else {
        logger.error('Failed to update bot commands', await response.text());
      }
    } catch (error) {
      logger.error('Error updating bot commands:', error);
    }

    res.status(200).send();
  }
);

/**
 * Handles incoming Telegram webhook requests.
 * This function processes user messages and manages subscriptions for product availability updates.
 *
 * @param req - The incoming HTTPS request object
 * @param res - The response object to send back to the client
 */
export const telegramWebhook = https.onRequest(
  async (req: https.Request, res: Response) => {
    try {
      const message = req.body.message;

      if (message && message.text) {
        const chatId = message.chat.id;
        const userMessage = message.text;

        if (userMessage.toLowerCase() === '/subscribe') {
          // Initiate subscription process
          await sendTelegramMessage(
            chatId,
            'Please enter the product ID you want to track:'
          );
        } else if (userMessage.toLowerCase() === '/unsubscribe') {
          // Unsubscribe user
          await db.collection('subscribers').doc(String(chatId)).delete();
          await sendTelegramMessage(
            chatId,
            'You have successfully unsubscribed from updates.'
          );
        } else if (userMessage.toLowerCase() === '/check') {
          // Check subscription status
          const subscriberRef = db
            .collection('subscribers')
            .doc(String(chatId));
          const subscriberDoc = await subscriberRef.get();

          if (subscriberDoc.exists && subscriberDoc.data()?.isSubscribed) {
            // User is subscribed, send current subscription details
            const subscriberData = subscriberDoc.data() as SubscriberData;
            const { productId, zipCode } = subscriberData;
            await sendTelegramMessage(
              chatId,
              `You are currently subscribed.\nProduct ID: ${productId}\nZIP Code: ${zipCode}`
            );

            // Check product availability immediately
            await checkProductAvailabilityByZipCode(
              productId,
              zipCode,
              chatId,
              true
            );
          } else {
            // User is not subscribed
            await sendTelegramMessage(
              chatId,
              'You are not currently subscribed to any product updates.'
            );
          }
        } else {
          // Handle product ID or ZIP code input
          const subscriberRef = db
            .collection('subscribers')
            .doc(String(chatId));
          const subscriberDoc = await subscriberRef.get();

          if (!subscriberDoc.exists || subscriberDoc.data()?.isSubscribed) {
            // Handle product ID input
            if (userMessage.match(/^[A-Z0-9]+\/[A-Z]$/)) {
              // Save product ID and prompt for ZIP code
              await subscriberRef.set(
                {
                  chatId: chatId,
                  productId: userMessage,
                  isSubscribed: false,
                  timestamp: firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
              );
              await sendTelegramMessage(
                chatId,
                `Product ID ${userMessage} saved. Now, please enter your ZIP code:`
              );
            } else {
              // Invalid product ID
              await sendTelegramMessage(
                chatId,
                'Invalid product ID. Please enter a valid product ID.'
              );
            }
          } else if (!subscriberDoc.data()?.isSubscribed) {
            // Handle ZIP code input
            if (userMessage.match(/^\d{5}$/)) {
              // Complete subscription process
              await subscriberRef.update({
                zipCode: userMessage,
                isSubscribed: true,
              });
              await sendTelegramMessage(
                chatId,
                'You have successfully subscribed to updates!'
              );

              // Check product availability immediately
              const subscriberData = subscriberDoc.data() as SubscriberData;
              const { productId, zipCode } = subscriberData;

              await checkProductAvailabilityByZipCode(
                productId,
                zipCode,
                chatId,
                true
              );
            } else {
              // Invalid ZIP code
              await sendTelegramMessage(
                chatId,
                'Invalid ZIP code. Please enter a valid 5-digit ZIP code.'
              );
            }
          }
        }

        // Send success response
        res.status(200).send();
      } else {
        // No valid message, send success response
        res.status(200).send();
      }
    } catch (error) {
      // Log error and send success response to acknowledge receipt
      logger.error('Error in telegramWebhook:', error);
      res.status(200).send();
    }
  }
);

/**
 * Scheduled function to check Apple product availability for all subscribers.
 * This function runs every minute and calls the checkAppleProductAvailability helper function.
 */
export const appleProductAvailabilityChecker = onSchedule(
  '* * * * *', // Runs every minute
  async () => {
    // Check Apple product availability for all subscribers
    await checkAppleProductAvailability();
  }
);

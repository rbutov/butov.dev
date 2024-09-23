import { firestore } from 'firebase-admin';
import { Response, https } from 'firebase-functions';
import { onSchedule } from 'firebase-functions/v2/scheduler';

import { db } from './firebase';
import {
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

export const telegramWebhook = https.onRequest(
  async (req: https.Request, res: Response) => {
    const message = req.body.message;

    if (message && message.text) {
      const chatId = message.chat.id;
      const userMessage = message.text;

      if (userMessage.toLowerCase() === '/subscribe') {
        await sendTelegramMessage(
          chatId,
          'Please enter the product ID you want to track:'
        );
      } else if (userMessage.toLowerCase() === '/unsubscribe') {
        await db.collection('subscribers').doc(String(chatId)).delete();
        await sendTelegramMessage(
          chatId,
          'You have successfully unsubscribed from updates.'
        );
      } else if (userMessage.toLowerCase() === '/check') {
        const subscriberRef = db.collection('subscribers').doc(String(chatId));
        const subscriberDoc = await subscriberRef.get();

        if (subscriberDoc.exists && subscriberDoc.data()?.isSubscribed) {
          const subscriberData = subscriberDoc.data() as SubscriberData;
          const { productId, zipCode } = subscriberData;
          await sendTelegramMessage(
            chatId,
            `You are currently subscribed.\nProduct ID: ${productId}\nZIP Code: ${zipCode}`
          );

          await checkProductAvailabilityByZipCode(
            productId,
            zipCode,
            chatId,
            true
          );
        } else {
          await sendTelegramMessage(
            chatId,
            'You are not currently subscribed to any product updates.'
          );
        }
      } else {
        const subscriberRef = db.collection('subscribers').doc(String(chatId));
        const subscriberDoc = await subscriberRef.get();

        if (!subscriberDoc.exists || subscriberDoc.data()?.isSubscribed) {
          if (userMessage.match(/^[A-Z0-9]+\/[A-Z]$/)) {
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
            await sendTelegramMessage(
              chatId,
              'Invalid product ID. Please enter a valid product ID.'
            );
          }
        } else if (!subscriberDoc.data()?.isSubscribed) {
          if (userMessage.match(/^\d{5}$/)) {
            await subscriberRef.update({
              zipCode: userMessage,
              isSubscribed: true,
            });
            await sendTelegramMessage(
              chatId,
              'You have successfully subscribed to updates!'
            );

            checkAppleProductAvailability();
          } else {
            await sendTelegramMessage(
              chatId,
              'Invalid ZIP code. Please enter a valid 5-digit ZIP code.'
            );
          }
        }
      }

      res.status(200).send();
    } else {
      res.status(400).send('Invalid Telegram message');
    }
  }
);

export const checkAppleProductAvailabilityFunction = onSchedule(
  '* * * * *',
  async () => {
    checkAppleProductAvailability();
  }
);

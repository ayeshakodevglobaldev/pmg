const axios = require('axios');
const amqp = require('amqplib');

class IntegrationService {
  constructor() {
    this.rabbitMqUrl = process.env.RABBITMQ_URL || 'amqp://localhost';
    this.raastApiUrl = process.env.RAAST_API_URL || 'http://localhost:3001';
  }
  
  /**
   * Send a message to the Raast API.
   * @param {Object} message - The Raast JSON message.
   * @returns {Promise<Object>} - The API response.
   */
  async sendToRaastApi(message) {
    try {
      console.log("Raast APi",this.raastApiUrl);
      console.log('Sending message to Raast API...');
      const response = await axios.post(`${this.raastApiUrl}/transactions`, message, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Raast API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message to Raast API:', error.message);
      throw error;
    }
  }

  /**
   * Publish a message to RabbitMQ.
   * @param {string} queue - The name of the RabbitMQ queue.
   * @param {Object} message - The message to publish.
   */
  async publishToRabbitMq(queue, message) {
    try {
      console.log(`Publishing message to RabbitMQ queue: ${queue} ${this.rabbitMqUrl} ${JSON.stringify(message, null, 2)}`);

      const connection = await amqp.connect(this.rabbitMqUrl);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      console.log('Message published to RabbitMQ:', JSON.stringify(message));
      await channel.close();
      await connection.close();
    } catch (error) {
      console.error('Error publishing message to RabbitMQ:', error.message);
      throw error;
    }
  }
}

module.exports = new IntegrationService();
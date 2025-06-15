const { createClient } = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = createClient();
    this.publisher = createClient();
    this.connected = false;

    this.init(); // Gọi hàm connect
  }

  async init() {
  if (this.connected) return; // ✅ ngăn gọi lại

  try {
    if (!this.subscriber.isOpen) await this.subscriber.connect();
    if (!this.publisher.isOpen) await this.publisher.connect();

    this.connected = true;
    console.log("✅ Redis Pub/Sub connected");
  } catch (err) {
    console.error("❌ Failed to connect Redis clients:", err);
  }
}

  async publish(channel, message) {
    if (!this.connected) await this.init();

    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async subscribe(channel, callback) {
    if (!this.connected) await this.init();

    this.subscriber.subscribe(channel, (message) => {
      callback(channel, message);
    });
  }
}

module.exports = new RedisPubSubService();

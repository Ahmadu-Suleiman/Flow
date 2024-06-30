import AfricasTalking from "africastalking";
import { config } from "dotenv";

// Load enviromental variable
config();

// Initialize Africa's Talking
const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

// Send an SMS to your phone number
// Your sender ID refers to the number (shortcode) you created in you Africa's Talking dashboard earlier
const sendSms = async (to, msg) => {
  try {
    const result = await africastalking.SMS.send({
      to: to,
      message: msg,
      from: process.env.AT_NUMBER,
    });
    console.log(`Sent -> '${msg}' to '${to}'`);
  } catch (ex) {
    console.error(ex);
  }
};

export { sendSms };

require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio'); // Twilio for WhatsApp API

const app = express();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve the frontend
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post('/registerDonor', (req, res) => {
  const donor = req.body;
  console.log('Donor registered:', donor);
  res.json({ message: 'Donor registered successfully!' });
});

app.post('/postRequirement', async (req, res) => {
  const { bloodType, quantity } = req.body;

  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', // Twilio WhatsApp Sandbox Number
      body: `New Blood Requirement:\nBlood Group: ${bloodType}\nQuantity: ${quantity} units`,
      to: 'whatsapp:+recipient_number' // Replace with your WhatsApp or group number
    });
    res.json({ message: 'Requirement posted and WhatsApp notification sent!' });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ message: 'Requirement posted, but notification failed.' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

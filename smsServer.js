import express from "express";
import { sendSms } from "./sendSMS.js";
const app = express();

// Lets simulate a database
const techEvents = []; // Events in the database
const users = ["+2348138445664", "+2348027020206"]; // User phone numbers in the database

app.use(express.urlencoded({ extended: true })); // Allows us receive the data sent from the event adding form

// Landing page
// Here we can add events through a HTML form
app.get("/", (req, res) => {
  // You can use res.send() to display any HTML you want
  res.send(`
    <style>
        form{
            font-family: sans-serif;
            left: 50%;
            position: absolute;
            top: 50%;
            transform: translate(-50%,-50%);
            max-width: 300px;
            width: 100%;
        }
        h1{
            margin-bottom: 1rem;
            color: steelblue;
        }
        input, textarea{
            border: 1px solid silver;
            border-radius: 5px;
            padding: .5rem 1rem;
            width: 100%;
        }
    </style>
      <form action="/event" method="post">
        <h1>Add Event</h1>
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br><br>
        <label for="msg">Description:</label><br>
        <textarea type="text" id="description" name="description"rows="4"></textarea><br><br>
        <label for="date">Date:</label><br>
        <input type="date" id="date" name="date"><br><br>
        <input type="submit">
      </form>
    `);
});

// Route for receiving event submitted in our form
app.post("/event", (req, res) => {
  const formData = req.body;

  // Form validation
  if (!formData.name || !formData.description || !formData.date) {
    sendSms(formData.from, "Please provide all the required information.");
    res.sendStatus(400);
  }

  // Add Event to database
  const eventId = techEvents.length + 1;
  techEvents.push({
    id: eventId,
    name: formData.name,
    description: formData.description,
    date: formData.date,
  });

  sendSms(users, `Event Id: ${eventId} \n${formData.description}`); // Use sendSMS() to broadcast the created Event to all our users
  res.status(200).redirect("/"); // Returns the user back to the form when they submit the event form
});

// Route to receive SMS from our users
app.post("/incoming-messages", async (req, res) => {
  const formData = req.body
  console.log(formData); // Logging the form data

  // To RSVP for an event, we expect the user to send the id of the event via SMS
  const eventId = formData.text;
  const event = techEvents.find((ev) => ev.id == eventId); // Search database for an event with the matching Id

  // validate event Id
  if (isNaN(eventId) || !event) {
    await sendSms(
      formData.from,
      `${eventId} not valid. Please provide a valid event Id.`
    );
    res.sendStatus(200);
  } else {
    console.log(techEvents); // Let the user know everything went well
    console.log(techEvents); // Let the user know everything went well
    await sendSms(formData.from, `You have saved a spot at ${event.name}`); // Let the user know everything went well
    res.status(200).send({ msg: "successful" });
  }
});

const port = 3000; // the port must match this value when port forwarding
app.listen(port, () => {
  console.log(`Event app listening on port ${port}`);
});

// Start the server and goto http://localhost:3000 in your browser

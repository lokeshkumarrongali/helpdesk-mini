const mongoose = require('mongoose');
require('dotenv').config();
const Ticket = require('./models/Ticket');

const tickets = [
  {
    title: "Password Reset",
    description: "User unable to reset password.",
    created_by: "John Doe",
    priority: "high",
    status: "open",
    sla_deadline: new Date("2025-10-10T10:00:00Z"),
    category: "Account Issue"
  },
  {
    title: "Email Not Working",
    description: "Unable to send/receive emails.",
    created_by: "Jane Smith",
    priority: "medium",
    status: "open",
    sla_deadline: new Date("2025-10-08T15:00:00Z"),
    category: "Email Support"
  },
  {
    title: "Printer Offline",
    description: "Printer not connecting to network.",
    created_by: "Alex Green",
    priority: "low",
    status: "closed",
    sla_deadline: new Date("2025-10-05T12:00:00Z"),
    category: "Hardware"
  }
];

async function seedTickets() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    await Ticket.deleteMany({});
    console.log("Deleted existing tickets");

    await Ticket.insertMany(tickets);
    console.log("Inserted sample tickets");

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedTickets();

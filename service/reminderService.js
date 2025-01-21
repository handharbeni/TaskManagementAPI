// services/reminderService.js  
const knex = require('../db');
const nodemailer = require('nodemailer'); // Assuming you are using nodemailer for sending emails  

class ReminderService {
    async sendReminders() {
        const now = new Date();
        const reminders = await knex('reminders')
            .where('reminder_time', '<=', now)
            .andWhere('sent', false); // Assuming you have a 'sent' column to track if the reminder has been sent  

        for (const reminder of reminders) {
            // Logic to send the reminder (e.g., email, notification)  
            await this.sendReminderEmail(reminder);

            // Mark the reminder as sent  
            await knex('reminders').where('reminder_id', reminder.reminder_id).update({ sent: true });
        }
    }

    async sendReminderEmail(reminder) {
        // Set up your email transport  
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Example using Gmail  
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password',
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: reminder.user_email, // Assuming you have the user's email in the reminder  
            subject: 'Reminder',
            text: `This is a reminder for your appointment at ${reminder.reminder_time}.`,
        };

        await transporter.sendMail(mailOptions);
    }
    // Create a reminder  
    async createReminder(subtask_id, reminder_time) {
        const reminder = {
            subtask_id,
            reminder_time,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const [reminder_id] = await knex('reminders').insert(reminder).returning('reminder_id');
        return { reminder_id, reminder_time };
    }

    // Get reminders for a specific subtask  
    async getSubtaskReminders(subtask_id) {
        return await knex('reminders').where({ subtask_id });
    }

    // Update a reminder  
    async updateReminder(reminder_id, reminder_time) {
        await knex('reminders').where({ reminder_id }).update({
            reminder_time,
            updated_at: new Date(),
        });
        return { message: 'Reminder updated successfully' };
    }

    // Delete a reminder  
    async deleteReminder(reminder_id) {
        await knex('reminders').where({ reminder_id }).del();
        return { message: 'Reminder deleted successfully' };
    }
}

module.exports = new ReminderService();  

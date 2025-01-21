const knex = require('../db');
// controllers/reminderController.js  
const reminderService = require('../service/reminderService');

// Function to create a reminder  
/**  
 * @swagger  
 * /reminders:  
 *   post:  
 *     summary: Create a new reminder  
 *     description: This endpoint creates a new reminder associated with a specific subtask.  
 *     tags:  
 *       - Reminders  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               subtask_id:  
 *                 type: integer  
 *                 description: The ID of the subtask to which the reminder is associated.  
 *                 example: 1  
 *               reminder_time:  
 *                 type: string  
 *                 format: date-time  
 *                 description: The time when the reminder should trigger.  
 *                 example: "2025-01-20T08:00:00Z"  
 *     responses:  
 *       201:  
 *         description: Reminder created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 reminder_id:  
 *                   type: integer  
 *                   description: The ID of the created reminder.  
 *                   example: 1  
 *                 subtask_id:  
 *                   type: integer  
 *                   description: The ID of the subtask associated with the reminder.  
 *                   example: 1  
 *                 reminder_time:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The time when the reminder is set.  
 *                   example: "2025-01-20T08:00:00Z"  
 *       500:  
 *         description: Failed to create reminder  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create reminder"  
 */  
const createReminder = async (req, res) => {  
    const { subtask_id, reminder_time } = req.body;  
  
    try {  
        const reminder = await reminderService.createReminder(subtask_id, reminder_time);  
        res.status(201).json(reminder);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create reminder' });  
    }  
};  


// Function to get reminders for a specific subtask  
/**  
 * @swagger  
 * /subtasks/{subtask_id}/reminders:  
 *   get:  
 *     summary: Retrieve reminders for a specific subtask  
 *     description: This endpoint retrieves all reminders associated with a specific subtask.  
 *     tags:  
 *       - Reminders  
 *     parameters:  
 *       - in: path  
 *         name: subtask_id  
 *         required: true  
 *         description: The ID of the subtask for which to retrieve reminders.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: A list of reminders for the specified subtask  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   reminder_id:  
 *                     type: integer  
 *                     description: The ID of the reminder.  
 *                     example: 1  
 *                   subtask_id:  
 *                     type: integer  
 *                     description: The ID of the associated subtask.  
 *                     example: 1  
 *                   reminder_time:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The time when the reminder is set.  
 *                     example: "2025-01-20T08:00:00Z"  
 *       500:  
 *         description: Failed to retrieve reminders  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve reminders"  
 */  
const getSubtaskReminders = async (req, res) => {  
    const { subtask_id } = req.params;  
  
    try {  
        const reminders = await reminderService.getSubtaskReminders(subtask_id);  
        res.status(200).json(reminders);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to retrieve reminders' });  
    }  
};  


// Function to update a reminder  
/**  
 * @swagger  
 * /reminders/{reminder_id}:  
 *   put:  
 *     summary: Update a specific reminder  
 *     description: This endpoint updates the reminder time for a specific reminder identified by its ID.  
 *     tags:  
 *       - Reminders  
 *     parameters:  
 *       - in: path  
 *         name: reminder_id  
 *         required: true  
 *         description: The ID of the reminder to be updated.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: body  
 *         name: body  
 *         required: true  
 *         description: The new reminder time.  
 *         schema:  
 *           type: object  
 *           properties:  
 *             reminder_time:  
 *               type: string  
 *               format: date-time  
 *               description: The new time for the reminder.  
 *               example: "2025-01-20T09:00:00Z"  
 *     responses:  
 *       200:  
 *         description: Reminder updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 reminder_id:  
 *                   type: integer  
 *                   description: The ID of the updated reminder.  
 *                   example: 1  
 *                 reminder_time:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The updated reminder time.  
 *                   example: "2025-01-20T09:00:00Z"  
 *       500:  
 *         description: Failed to update reminder  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update reminder"  
 */  
const updateReminder = async (req, res) => {  
    const { reminder_id } = req.params;  
    const { reminder_time } = req.body;  
  
    try {  
        const response = await reminderService.updateReminder(reminder_id, reminder_time);  
        res.status(200).json(response);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to update reminder' });  
    }  
};  


// Function to delete a reminder  
/**  
 * @swagger  
 * /reminders/{reminder_id}:  
 *   delete:  
 *     summary: Delete a specific reminder  
 *     description: This endpoint deletes a specific reminder identified by its ID.  
 *     tags:  
 *       - Reminders  
 *     parameters:  
 *       - in: path  
 *         name: reminder_id  
 *         required: true  
 *         description: The ID of the reminder to be deleted.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Reminder deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Confirmation message indicating the reminder was deleted.  
 *                   example: "Reminder deleted successfully"  
 *       500:  
 *         description: Failed to delete reminder  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete reminder"  
 */  
const deleteReminder = async (req, res) => {  
    const { reminder_id } = req.params;  
  
    try {  
        const response = await reminderService.deleteReminder(reminder_id);  
        res.status(200).json(response);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to delete reminder' });  
    }  
};  


// Export the methods  
module.exports = {
    createReminder,
    getSubtaskReminders,
    updateReminder,
    deleteReminder,
};  

const knex = require('../db');
const appointmentService = require('../service/appointmentService');
const reminderService = require('../service/reminderService');
// Function to create an appointment  
/**  
 * @swagger  
 * /appointments:  
 *   post:  
 *     summary: Create a new appointment  
 *     description: This endpoint creates a new appointment for a client and optionally sets a reminder for it.  
 *     tags:  
 *       - Appointments  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               client_id:  
 *                 type: integer  
 *                 description: The ID of the client for whom the appointment is being created.  
 *                 example: 1  
 *               user_id:  
 *                 type: integer  
 *                 description: The ID of the user (e.g., staff member) creating the appointment.  
 *                 example: 2  
 *               appointment_time:  
 *                 type: string  
 *                 format: date-time  
 *                 description: The date and time of the appointment.  
 *                 example: "2025-01-20T10:00:00Z"  
 *               reminder_time:  
 *                 type: string  
 *                 format: date-time  
 *                 description: The date and time for the reminder to be set.  
 *                 example: "2025-01-19T10:00:00Z"  
 *     responses:  
 *       201:  
 *         description: Appointment created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 appointment_id:  
 *                   type: integer  
 *                   description: The ID of the newly created appointment.  
 *                   example: 1  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the client for whom the appointment was created.  
 *                   example: 1  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the user who created the appointment.  
 *                   example: 2  
 *                 appointment_time:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time of the appointment.  
 *                   example: "2025-01-20T10:00:00Z"  
 *       400:  
 *         description: Bad request, missing parameters  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the request was malformed.  
 *                   example: "Missing client_id, user_id, or appointment_time"  
 *       500:  
 *         description: Failed to create appointment  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create appointment"  
 */
const createAppointment = async (req, res) => {
    const { client_id, user_id, appointment_time, reminder_time } = req.body;

    try {
        // Create the appointment    
        const appointment = await appointmentService.createAppointment(client_id, user_id, appointment_time);

        // Automatically create a reminder for the appointment    
        if (reminder_time) {
            await reminderService.createReminder(appointment.appointment_id, reminder_time);
        }

        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};


/**  
 * @swagger  
 * /appointments/{appointment_id}:  
 *   get:  
 *     summary: Retrieve a specific appointment  
 *     description: This endpoint retrieves the details of a specific appointment by its ID.  
 *     tags:  
 *       - Appointments  
 *     parameters:  
 *       - in: path  
 *         name: appointment_id  
 *         required: true  
 *         description: The ID of the appointment to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Appointment retrieved successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 appointment_id:  
 *                   type: integer  
 *                   description: The ID of the appointment.  
 *                   example: 1  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the client associated with the appointment.  
 *                   example: 1  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the user who created the appointment.  
 *                   example: 2  
 *                 appointment_time:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time of the appointment.  
 *                   example: "2025-01-20T10:00:00Z"  
 *                 created_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time when the appointment was created.  
 *                   example: "2025-01-15T10:00:00Z"  
 *                 updated_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time when the appointment was last updated.  
 *                   example: "2025-01-15T10:00:00Z"  
 *       404:  
 *         description: Appointment not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the appointment was not found.  
 *                   example: "Appointment not found"  
 *       500:  
 *         description: Failed to retrieve appointment  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve appointment"  
 */
const getAppointment = async (req, res) => {
    const { appointment_id } = req.params;

    try {
        const appointment = await knex('appointments').where({ appointment_id }).first();
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve appointment' });
    }
};


/**  
 * @swagger  
 * /appointments/{appointment_id}:  
 *   put:  
 *     summary: Update a specific appointment  
 *     description: This endpoint updates the details of a specific appointment by its ID.  
 *     tags:  
 *       - Appointments  
 *     parameters:  
 *       - in: path  
 *         name: appointment_id  
 *         required: true  
 *         description: The ID of the appointment to update.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               appointment_time:  
 *                 type: string  
 *                 format: date-time  
 *                 description: The new date and time for the appointment.  
 *                 example: "2025-01-21T10:00:00Z"  
 *     responses:  
 *       200:  
 *         description: Appointment updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the appointment was updated.  
 *                   example: "Appointment updated successfully"  
 *       404:  
 *         description: Appointment not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the appointment was not found.  
 *                   example: "Appointment not found"  
 *       500:  
 *         description: Failed to update appointment  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update appointment"  
 */
const updateAppointment = async (req, res) => {
    const { appointment_id } = req.params;
    const { appointment_time } = req.body;

    try {
        await knex('appointments').where({ appointment_id }).update({
            appointment_time,
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};


/**  
 * @swagger  
 * /appointments/{appointment_id}:  
 *   delete:  
 *     summary: Soft delete a specific appointment  
 *     description: This endpoint marks a specific appointment as deleted by setting the `deleted_at` timestamp.  
 *     tags:  
 *       - Appointments  
 *     parameters:  
 *       - in: path  
 *         name: appointment_id  
 *         required: true  
 *         description: The ID of the appointment to delete.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Appointment deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the appointment was deleted.  
 *                   example: "Appointment deleted successfully"  
 *       404:  
 *         description: Appointment not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the appointment was not found.  
 *                   example: "Appointment not found"  
 *       500:  
 *         description: Failed to delete appointment  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete appointment"  
 */
const deleteAppointment = async (req, res) => {
    const { appointment_id } = req.params;

    try {
        await knex('appointments').where({ appointment_id }).update({
            deleted_at: new Date(),
        });

        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
};


module.exports = {
    createAppointment,
    getAppointment,
    updateAppointment,
    deleteAppointment,
};  

// services/appointmentService.js  
const knex = require('../db');

class AppointmentService {
    // Create an appointment  
    async createAppointment(client_id, user_id, appointment_time) {
        const appointment = {
            client_id,
            user_id,
            appointment_time,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const [appointment_id] = await knex('appointments').insert(appointment).returning('appointment_id');
        return { appointment_id, client_id, user_id, appointment_time };
    }

    // Other methods...  
}

module.exports = new AppointmentService();  

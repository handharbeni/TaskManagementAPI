const knex = require('../db');

// Function to generate member report  
/**  
 * @swagger  
 * /report/member:  
 *   get:  
 *     summary: Generate a report of task assignments by member  
 *     description: This endpoint retrieves a report showing the count of tasks assigned to each member, categorized by their status (Completed and In Progress).  
 *     tags:  
 *       - Reports  
 *     responses:  
 *       200:  
 *         description: A report of task assignments by member  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   assigned_to:  
 *                     type: integer  
 *                     description: The ID of the member assigned to the tasks.  
 *                     example: 1  
 *                   done:  
 *                     type: integer  
 *                     description: The count of tasks marked as completed.  
 *                     example: 5  
 *                   in_progress:  
 *                     type: integer  
 *                     description: The count of tasks currently in progress.  
 *                     example: 3  
 *       500:  
 *         description: Failed to generate member report  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to generate member report"  
 */  
const reportMember = async (req, res) => {  
    try {  
        const memberReports = await knex('subtasks')  
            .select('assigned_to')  
            .count({ done: knex.raw('CASE WHEN status = ?', ['Completed']) })  
            .count({ in_progress: knex.raw('CASE WHEN status = ?', ['In Progress']) })  
            .groupBy('assigned_to');  
  
        res.status(200).json(memberReports);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to generate member report' });  
    }  
};  


// Function to generate team report  
/**  
 * @swagger  
 * /report/team:  
 *   get:  
 *     summary: Generate a report of task assignments by team  
 *     description: This endpoint retrieves a report showing the count of tasks assigned to each team, categorized by their status (Completed, In Progress, and Pending).  
 *     tags:  
 *       - Reports  
 *     responses:  
 *       200:  
 *         description: A report of task assignments by team  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   team_id:  
 *                     type: integer  
 *                     description: The ID of the team assigned to the tasks.  
 *                     example: 1  
 *                   done:  
 *                     type: integer  
 *                     description: The count of tasks marked as completed.  
 *                     example: 10  
 *                   in_progress:  
 *                     type: integer  
 *                     description: The count of tasks currently in progress.  
 *                     example: 4  
 *                   available:  
 *                     type: integer  
 *                     description: The count of tasks pending.  
 *                     example: 2  
 *       500:  
 *         description: Failed to generate team report  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to generate team report"  
 */  
const reportTeam = async (req, res) => {  
    try {  
        const teamReports = await knex('tasks')  
            .select('team_id')  
            .count({ done: knex.raw('CASE WHEN status = ?', ['Completed']) })  
            .count({ in_progress: knex.raw('CASE WHEN status = ?', ['In Progress']) })  
            .count({ available: knex.raw('CASE WHEN status = ?', ['Pending']) })  
            .groupBy('team_id');  
  
        res.status(200).json(teamReports);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to generate team report' });  
    }  
};  


// Function to generate application type report  
/**  
 * @swagger  
 * /report/application-type:  
 *   get:  
 *     summary: Generate a report of application types by status  
 *     description: This endpoint retrieves a report showing the count and percentage of applications grouped by their status.  
 *     tags:  
 *       - Reports  
 *     responses:  
 *       200:  
 *         description: A report of application types by status  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   status:  
 *                     type: string  
 *                     description: The status of the application.  
 *                     example: "Pending"  
 *                   percentage:  
 *                     type: string  
 *                     description: The percentage of applications with this status.  
 *                     example: "50.00%"  
 *       500:  
 *         description: Failed to generate application type report  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to generate application type report"  
 */  
const reportApplicationType = async (req, res) => {  
    try {  
        const applicationTypes = await knex('applications')  
            .select('status')  
            .count('* as count')  
            .groupBy('status');  
  
        const totalApplications = applicationTypes.reduce((sum, app) => sum + app.count, 0);  
        const applicationTypePercentages = applicationTypes.map(app => ({  
            status: app.status,  
            percentage: ((app.count / totalApplications) * 100).toFixed(2) + '%'  
        }));  
  
        res.status(200).json(applicationTypePercentages);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to generate application type report' });  
    }  
};  


// Function to generate successful applications report  
/**  
 * @swagger  
 * /report/successful-applications:  
 *   get:  
 *     summary: Generate a report of successful applications  
 *     description: This endpoint retrieves the count of applications that have been approved.  
 *     tags:  
 *       - Reports  
 *     responses:  
 *       200:  
 *         description: The count of successful applications  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 successfulApplicationsCount:  
 *                   type: integer  
 *                   description: The total number of applications that have been approved.  
 *                   example: 150  
 *       500:  
 *         description: Failed to generate successful applications report  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to generate successful applications report"  
 */  
const reportSuccessfulApplications = async (req, res) => {  
    try {  
        const successfulApplicationsCount = await knex('applications')  
            .where('status', 'Approved')  
            .count('* as count');  
  
        res.status(200).json({ successfulApplicationsCount: successfulApplicationsCount[0].count });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to generate successful applications report' });  
    }  
};  


// Export the report functions  
module.exports = {
    reportMember,
    reportTeam,
    reportApplicationType,
    reportSuccessfulApplications,
};  

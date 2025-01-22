require('dotenv').config();
const bcrypt = require('bcrypt');
const knex = require('../db')
const jwt = require('jsonwebtoken');

// Client Controller  
const clientController = {
    // User Registration  
    register: async (req, res) => {
        const { name, email, phone, address, password } = req.body;

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const [client_id] = await knex('clients').insert({
                name,
                email,
                phone,
                address,
                password_hash: hashedPassword,
                created_at: new Date(),
                updated_at: new Date(),
            }).returning('client_id');

            res.status(201).json({ client_id });
        } catch (error) {
            res.status(500).json({ error: 'Failed to register client' });
        }
    },

    // User Login  
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const client = await knex('clients').where({ email }).first();

            if (client && await bcrypt.compare(password, client.password_hash)) {
                // Generate a token (optional)  
                const token = jwt.sign({ client_id: client.client_id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.status(200).json({ message: 'Login successful', client_id: client.client_id, token });
            } else {
                res.status(401).json({ error: 'Invalid email or password' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to login' });
        }
    },

    // Forgot Password  
    forgotPassword: async (req, res) => {
        const { email } = req.body;

        try {
            const client = await knex('clients').where({ email }).first();

            if (client) {
                // Here you would typically send an email with a reset link  
                // For demonstration, we'll just return a success message  
                res.status(200).json({ message: 'Password reset link sent to your email' });
            } else {
                res.status(404).json({ error: 'Email not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to process forgot password request' });
        }
    },

    // Delete Account  
    deleteAccount: async (req, res) => {
        const { client_id } = req.params; // Assuming client_id is passed as a URL parameter  

        try {
            await knex('clients').where({ client_id }).update({
                deleted_at: new Date(),
                updated_at: new Date(),
            });

            res.status(200).json({ message: 'Account deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete account' });
        }
    }
};

/**  
 * @swagger  
 * /api/account/register:  
 *   post:  
 *     summary: Register a new client  
 *     description: This endpoint allows for the registration of a new client by providing their details.  
 *     tags:  
 *       - Clients  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               name:  
 *                 type: string  
 *                 description: The name of the client.  
 *                 example: "John Doe"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the client.  
 *                 example: "john@example.com"  
 *               phone:  
 *                 type: string  
 *                 description: The phone number of the client.  
 *                 example: "+1234567890"  
 *               address:  
 *                 type: string  
 *                 description: The address of the client.  
 *                 example: "123 Main St, City, Country"  
 *               password:  
 *                 type: string  
 *                 description: The password for the client.  
 *                 example: "securePassword123"  
 *     responses:  
 *       201:  
 *         description: Client registered successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the newly registered client.  
 *                   example: 1  
 *       500:  
 *         description: Failed to register client  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to register client"  
 */  
  
/**  
 * @swagger  
 * /api/account/login:  
 *   post:  
 *     summary: User login  
 *     description: This endpoint allows a user to log in by providing their email and password.  
 *     tags:  
 *       - Clients  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               email:  
 *                 type: string  
 *                 description: The email of the user trying to log in.  
 *                 example: "user@example.com"  
 *               password:  
 *                 type: string  
 *                 description: The password of the user.  
 *                 example: "userPassword123"  
 *     responses:  
 *       200:  
 *         description: Login successful  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Confirmation message indicating successful login.  
 *                   example: "Login successful"  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the logged-in client.  
 *                   example: 1  
 *       401:  
 *         description: Invalid email or password  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating invalid credentials.  
 *                   example: "Invalid email or password"  
 *       500:  
 *         description: Failed to login  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to login"  
 */  
  
/**  
 * @swagger  
 * /api/account/forgot-password:  
 *   post:  
 *     summary: Forgot password  
 *     description: This endpoint allows a user to request a password reset by providing their email.  
 *     tags:  
 *       - Clients  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the client.  
 *                 example: "john@example.com"  
 *     responses:  
 *       200:  
 *         description: Password reset link sent successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Confirmation message indicating the reset link was sent.  
 *                   example: "Password reset link sent to your email"  
 *       404:  
 *         description: Email not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the email was not found.  
 *                   example: "Email not found"  
 *       500:  
 *         description: Failed to process forgot password request  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to process forgot password request"  
 */  
  
/**  
 * @swagger  
 * /api/account/{client_id}:  
 *   delete:  
 *     summary: Delete client account  
 *     description: This endpoint allows a user to delete their account by providing their client ID.  
 *     tags:  
 *       - Clients  
 *     parameters:  
 *       - in: path  
 *         name: client_id  
 *         required: true  
 *         description: The ID of the client whose account is being deleted.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Account deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Confirmation message indicating successful account deletion.  
 *                   example: "Account deleted successfully"  
 *       500:  
 *         description: Failed to delete account  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete account"  
 */  


module.exports = clientController;
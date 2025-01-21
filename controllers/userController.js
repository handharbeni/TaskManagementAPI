const knex = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Function to register a user  
/**  
 * @swagger  
 * /api/users/register:  
 *   post:  
 *     summary: Register a new user  
 *     description: This endpoint allows for the registration of a new user by providing a username, email, password, and role.  
 *     tags:  
 *       - Users  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 description: The username of the new user.  
 *                 example: "john_doe"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the new user.  
 *                 example: "john@example.com"  
 *               password:  
 *                 type: string  
 *                 description: The password for the new user.  
 *                 example: "securePassword123"  
 *               role:  
 *                 type: string  
 *                 description: The role assigned to the new user (e.g., admin, user).  
 *                 example: "user"  
 *     responses:  
 *       201:  
 *         description: User registered successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the newly registered user.  
 *                   example: 1  
 *       500:  
 *         description: Failed to register user  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to register user"  
 */  
const registerUser = async (req, res) => {  
    const { username, email, password, role } = req.body;  
  
    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const [user_id] = await knex('users').insert({  
            username,  
            email,  
            password_hash: hashedPassword,  
            role,  
            created_at: new Date(),  
            updated_at: new Date(),  
        }).returning('user_id');  
  
        res.status(201).json({ user_id });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to register user' });  
    }  
};  


// Function to create a member  
/**  
 * @swagger  
 * /api/users/members:  
 *   post:  
 *     summary: Create a new member  
 *     description: This endpoint allows for the creation of a new member by providing a username, email, and password.  
 *     tags:  
 *       - Members  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 description: The username of the new member.  
 *                 example: "jane_doe"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the new member.  
 *                 example: "jane@example.com"  
 *               password:  
 *                 type: string  
 *                 description: The password for the new member.  
 *                 example: "securePassword456"  
 *     responses:  
 *       201:  
 *         description: Member created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the newly created member.  
 *                   example: 2  
 *       500:  
 *         description: Failed to create member  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create member"  
 */  
const createMember = async (req, res) => {  
    const { username, email, password } = req.body;  
  
    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const [user_id] = await knex('users').insert({  
            username,  
            email,  
            password_hash: hashedPassword,  
            role: 'Member',  
            created_at: new Date(),  
            updated_at: new Date(),  
        }).returning('user_id');  
  
        res.status(201).json({ user_id });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create member' });  
    }  
};  


// Function to create an admin  
/**  
 * @swagger  
 * /api/users/admins:  
 *   post:  
 *     summary: Create a new admin  
 *     description: This endpoint allows for the creation of a new admin by providing a username, email, and password.  
 *     tags:  
 *       - Admins  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 description: The username of the new admin.  
 *                 example: "admin_user"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the new admin.  
 *                 example: "admin@example.com"  
 *               password:  
 *                 type: string  
 *                 description: The password for the new admin.  
 *                 example: "secureAdminPassword123"  
 *     responses:  
 *       201:  
 *         description: Admin created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the newly created admin.  
 *                   example: 1  
 *       500:  
 *         description: Failed to create admin  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create admin"  
 */  
const createAdmin = async (req, res) => {  
    const { username, email, password } = req.body;  
  
    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const [user_id] = await knex('users').insert({  
            username,  
            email,  
            password_hash: hashedPassword,  
            role: 'Admin',  
            created_at: new Date(),  
            updated_at: new Date(),  
        }).returning('user_id');  
  
        res.status(201).json({ user_id });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create admin' });  
    }  
};  


// Function to create a manager  
/**  
 * @swagger  
 * /api/users/managers:  
 *   post:  
 *     summary: Create a new manager  
 *     description: This endpoint allows for the creation of a new manager by providing a username, email, and password.  
 *     tags:  
 *       - Managers  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 description: The username of the new manager.  
 *                 example: "manager_user"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the new manager.  
 *                 example: "manager@example.com"  
 *               password:  
 *                 type: string  
 *                 description: The password for the new manager.  
 *                 example: "secureManagerPassword123"  
 *     responses:  
 *       201:  
 *         description: Manager created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the newly created manager.  
 *                   example: 1  
 *       500:  
 *         description: Failed to create manager  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create manager"  
 */  
const createManager = async (req, res) => {  
    const { username, email, password } = req.body;  
  
    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const [user_id] = await knex('users').insert({  
            username,  
            email,  
            password_hash: hashedPassword,  
            role: 'Manager',  
            created_at: new Date(),  
            updated_at: new Date(),  
        }).returning('user_id');  
  
        res.status(201).json({ user_id });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create manager' });  
    }  
};  


// Function to create a notaris  
/**  
 * @swagger  
 * /api/users/notaris:  
 *   post:  
 *     summary: Create a new notaris  
 *     description: This endpoint allows for the creation of a new notaris by providing a username, email, and password.  
 *     tags:  
 *       - Notaris  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               username:  
 *                 type: string  
 *                 description: The username of the new notaris.  
 *                 example: "notaris_user"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The email address of the new notaris.  
 *                 example: "notaris@example.com"  
 *               password:  
 *                 type: string  
 *                 description: The password for the new notaris.  
 *                 example: "secureNotarisPassword123"  
 *     responses:  
 *       201:  
 *         description: Notaris created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the newly created notaris.  
 *                   example: 1  
 *       500:  
 *         description: Failed to create notaris  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create notaris"  
 */  
const createNotaris = async (req, res) => {  
    const { username, email, password } = req.body;  
  
    try {  
        const hashedPassword = await bcrypt.hash(password, 10);  
        const [user_id] = await knex('users').insert({  
            username,  
            email,  
            password_hash: hashedPassword,  
            role: 'Notaris',  
            created_at: new Date(),  
            updated_at: new Date(),  
        }).returning('user_id');  
  
        res.status(201).json({ user_id });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to create notaris' });  
    }  
};  


// Function to reset the password of the user  
/**  
 * @swagger  
 * /api/users/reset-password:  
 *   post:  
 *     summary: Reset user password  
 *     description: This endpoint allows a user to reset their password by providing their user ID and a new password.  
 *     tags:  
 *       - Users  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               user_id:  
 *                 type: integer  
 *                 description: The ID of the user whose password is being reset.  
 *                 example: 1  
 *               newPassword:  
 *                 type: string  
 *                 description: The new password for the user.  
 *                 example: "newSecurePassword123"  
 *     responses:  
 *       200:  
 *         description: Password reset successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Confirmation message indicating the password was reset.  
 *                   example: "Password reset successfully"  
 *       500:  
 *         description: Failed to reset password  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to reset password"  
 */  
const resetPassword = async (req, res) => {  
    const { user_id, newPassword } = req.body;  
  
    try {  
        const hashedPassword = await bcrypt.hash(newPassword, 10);  
        await knex('users').where({ user_id }).update({  
            password_hash: hashedPassword,  
            updated_at: new Date(),  
        });  
  
        res.status(200).json({ message: 'Password reset successfully' });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to reset password' });  
    }  
};  

/**  
 * @swagger  
 * /api/users/login:  
 *   post:  
 *     summary: User login  
 *     description: This endpoint allows a user to log in by providing their email and password.  
 *     tags:  
 *       - Users  
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
 *                 user_id:  
 *                   type: integer  
 *                   description: The ID of the logged-in user.  
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
const login = async (req, res) => {  
    const { email, password } = req.body;  
  
    try {  
        // Find the user by email  
        const user = await knex('users').where({ email }).first();  
  
        // Check if user exists and password matches  
        if (user && await bcrypt.compare(password, user.password_hash)) {  
            // Here you would typically generate a token (e.g., JWT) for the user  
            res.status(200).json({ message: 'Login successful', user_id: user.user_id });  
        } else {  
            res.status(401).json({ error: 'Invalid email or password' });  
        }  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to login' });  
    }  
}; 

// Export the user functions  
module.exports = {
    registerUser,
    createMember,
    createAdmin,
    createManager,
    createNotaris,
    resetPassword,
    login,
};  

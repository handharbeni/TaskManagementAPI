// controllers/clientController.js  
const Client = require('../models/Client');


/**  
 * @swagger  
 * /api/clients:
 *   post:  
 *     summary: Create a new client  
 *     description: This endpoint allows for the creation of a new client by providing their name, email, phone, and address.  
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
 *                 example: "john.doe@example.com"  
 *               phone:  
 *                 type: string  
 *                 description: The phone number of the client.  
 *                 example: "123-456-7890"  
 *               address:  
 *                 type: string  
 *                 description: The address of the client.  
 *                 example: "123 Main St, Anytown, USA"  
 *     responses:  
 *       201:  
 *         description: Client created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the newly created client.  
 *                   example: 1  
 *                 name:  
 *                   type: string  
 *                   description: The name of the client.  
 *                   example: "John Doe"  
 *                 email:  
 *                   type: string  
 *                   format: email  
 *                   description: The email address of the client.  
 *                   example: "john.doe@example.com"  
 *                 phone:  
 *                   type: string  
 *                   description: The phone number of the client.  
 *                   example: "123-456-7890"  
 *                 address:  
 *                   type: string  
 *                   description: The address of the client.  
 *                   example: "123 Main St, Anytown, USA"  
 *                 created_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The timestamp when the client was created.  
 *                   example: "2023-10-01T12:34:56.789Z"  
 *                 updated_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The timestamp when the client was last updated.  
 *                   example: "2023-10-01T12:34:56.789Z"  
 *       500:  
 *         description: Failed to create client  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create client"  
 *                 details:  
 *                   type: string  
 *                   description: Detailed error message.  
 *                   example: "Database error"  
 *  
 *   get:  
 *     summary: Get all clients  
 *     description: This endpoint retrieves a list of all clients.  
 *     tags:  
 *       - Clients  
 *     responses:  
 *       200:  
 *         description: List of clients  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   client_id:  
 *                     type: integer  
 *                     description: The ID of the client.  
 *                     example: 1  
 *                   name:  
 *                     type: string  
 *                     description: The name of the client.  
 *                     example: "John Doe"  
 *                   email:  
 *                     type: string  
 *                     format: email  
 *                     description: The email address of the client.  
 *                     example: "john.doe@example.com"  
 *                   phone:  
 *                     type: string  
 *                     description: The phone number of the client.  
 *                     example: "123-456-7890"  
 *                   address:  
 *                     type: string  
 *                     description: The address of the client.  
 *                     example: "123 Main St, Anytown, USA"  
 *                   created_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The timestamp when the client was created.  
 *                     example: "2023-10-01T12:34:56.789Z"  
 *                   updated_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The timestamp when the client was last updated.  
 *                     example: "2023-10-01T12:34:56.789Z"  
 *       500:  
 *         description: Failed to retrieve clients  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve clients"  
 *                 details:  
 *                   type: string  
 *                   description: Detailed error message.  
 *                   example: "Database error"  
 *  
 * /api/clients/{client_id}:  
 *   get:  
 *     summary: Get a client by ID  
 *     description: This endpoint retrieves a client by their ID.  
 *     tags:  
 *       - Clients  
 *     parameters:  
 *       - in: path  
 *         name: client_id  
 *         required: true  
 *         description: The ID of the client to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Client details  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the client.  
 *                   example: 1  
 *                 name:  
 *                   type: string  
 *                   description: The name of the client.  
 *                   example: "John Doe"  
 *                 email:  
 *                   type: string  
 *                   format: email  
 *                   description: The email address of the client.  
 *                   example: "john.doe@example.com"  
 *                 phone:  
 *                   type: string  
 *                   description: The phone number of the client.  
 *                   example: "123-456-7890"  
 *                 address:  
 *                   type: string  
 *                   description: The address of the client.  
 *                   example: "123 Main St, Anytown, USA"  
 *                 created_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The timestamp when the client was created.  
 *                   example: "2023-10-01T12:34:56.789Z"  
 *                 updated_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The timestamp when the client was last updated.  
 *                   example: "2023-10-01T12:34:56.789Z"  
 *       404:  
 *         description: Client not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the client was not found.  
 *                   example: "Client not found"  
 *       500:  
 *         description: Failed to retrieve client  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve client"  
 *                 details:  
 *                   type: string  
 *                   description: Detailed error message.  
 *                   example: "Database error"  
 *  
 *   put:  
 *     summary: Update a client by ID  
 *     description: This endpoint updates a client's information by their ID.  
 *     tags:  
 *       - Clients  
 *     parameters:  
 *       - in: path  
 *         name: client_id  
 *         required: true  
 *         description: The ID of the client to update.  
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
 *               name:  
 *                 type: string  
 *                 description: The updated name of the client.  
 *                 example: "John Doe"  
 *               email:  
 *                 type: string  
 *                 format: email  
 *                 description: The updated email address of the client.  
 *                 example: "john.doe@example.com"  
 *               phone:  
 *                 type: string  
 *                 description: The updated phone number of the client.  
 *                 example: "123-456-7890"  
 *               address:  
 *                 type: string  
 *                 description: The updated address of the client.  
 *                 example: "123 Main St, Anytown, USA"  
 *     responses:  
 *       200:  
 *         description: Client updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the updated client.  
 *                   example: 1  
 *                 name:  
 *                   type: string  
 *                   description: The updated name of the client.  
 *                   example: "John Doe"  
 *                 email:  
 *                   type: string  
 *                   format: email  
 *                   description: The updated email address of the client.  
 *                   example: "john.doe@example.com"  
 *                 phone:  
 *                   type: string  
 *                   description: The updated phone number of the client.  
 *                   example: "123-456-7890"  
 *                 address:  
 *                   type: string  
 *                   description: The updated address of the client.  
 *                   example: "123 Main St, Anytown, USA"  
 *                 created_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The timestamp when the client was created.  
 *                   example: "2023-10-01T12:34:56.789Z"  
 *                 updated_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The timestamp when the client was last updated.  
 *                   example: "2023-10-01T12:34:56.789Z"  
 *       404:  
 *         description: Client not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the client was not found.  
 *                   example: "Client not found"  
 *       500:  
 *         description: Failed to update client  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update client"  
 *                 details:  
 *                   type: string  
 *                   description: Detailed error message.  
 *                   example: "Database error"  
 *  
 *   delete:  
 *     summary: Delete a client by ID  
 *     description: This endpoint deletes a client by their ID.  
 *     tags:  
 *       - Clients  
 *     parameters:  
 *       - in: path  
 *         name: client_id  
 *         required: true  
 *         description: The ID of the client to delete.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Client deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Confirmation message indicating the client was deleted.  
 *                   example: "Client deleted successfully"  
 *       404:  
 *         description: Client not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the client was not found.  
 *                   example: "Client not found"  
 *       500:  
 *         description: Failed to delete client  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete client"  
 *                 details:  
 *                   type: string  
 *                   description: Detailed error message.  
 *                   example: "Database error"  
 */


const createClient = async (req, res) => {
    const { name, email, phone, address } = req.body;

    try {
        const [client] = await Client.create({ name, email, phone, address });
        res.status(201).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create client', details: error.message });
    }
};

const getClients = async (req, res) => {
    try {
        const clients = await Client.getAll();
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve clients', details: error.message });
    }
};

const getClientById = async (req, res) => {
    const { client_id } = req.params;

    try {
        const client = await Client.getById(client_id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve client', details: error.message });
    }
};

const updateClient = async (req, res) => {
    const { client_id } = req.params;
    const { name, email, phone, address } = req.body;

    try {
        const [updatedClient] = await Client.update(client_id, { name, email, phone, address, updated_at: new Date() });
        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update client', details: error.message });
    }
};

const deleteClient = async (req, res) => {
    const { client_id } = req.params;

    try {
        const deletedCount = await Client.delete(client_id);
        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete client', details: error.message });
    }
};

module.exports = {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
};  

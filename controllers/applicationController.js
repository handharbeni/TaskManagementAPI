const knex = require('../db');

/**  
 * @swagger  
 * /api/application/applications:  
 *   post:  
 *     summary: Create a new application  
 *     description: This endpoint allows you to create a new application for a client.  
 *     tags:  
 *       - Applications  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               client_id:  
 *                 type: integer  
 *                 description: The ID of the client submitting the application.  
 *                 example: 1  
 *               status:  
 *                 type: string  
 *                 description: The current status of the application.  
 *                 example: "pending"  
 *               document_path:  
 *                 type: string  
 *                 description: The path to the document associated with the application.  
 *                 example: "/documents/applications/1.pdf"  
 *               hard_file_position:  
 *                 type: string  
 *                 description: The physical location of the hard copy of the application.  
 *                 example: "File Room A"  
 *     responses:  
 *       201:  
 *         description: Application created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 application_id:  
 *                   type: integer  
 *                   description: The ID of the newly created application.  
 *                   example: 1  
 *       500:  
 *         description: Failed to create application  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create application"  
 */
const createApplication = async (req, res) => {
    const { client_id, status, document_path, hard_file_position } = req.body;

    try {
        const [application_id] = await knex('applications').insert({
            client_id,
            submitted_at: new Date(),
            status,
            document_path,
            hard_file_position,
            created_at: new Date(),
            updated_at: new Date(),
        }).returning('application_id');

        res.status(201).json({ application_id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create application' });
    }
};

/**  
 * @swagger  
 * /api/application/applications/{application_id}:  
 *   get:  
 *     summary: Retrieve an application by ID  
 *     description: This endpoint allows you to retrieve a specific application using its ID.  
 *     tags:  
 *       - Applications  
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Application retrieved successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 application_id:  
 *                   type: integer  
 *                   description: The ID of the application.  
 *                   example: 1  
 *                 client_id:  
 *                   type: integer  
 *                   description: The ID of the client associated with the application.  
 *                   example: 1  
 *                 submitted_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time when the application was submitted.  
 *                   example: "2025-01-20T06:49:00Z"  
 *                 status:  
 *                   type: string  
 *                   description: The current status of the application.  
 *                   example: "pending"  
 *                 document_path:  
 *                   type: string  
 *                   description: The path to the document associated with the application.  
 *                   example: "/documents/applications/1.pdf"  
 *                 hard_file_position:  
 *                   type: string  
 *                   description: The physical location of the hard copy of the application.  
 *                   example: "File Room A"  
 *                 created_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time when the application was created.  
 *                   example: "2025-01-20T06:49:00Z"  
 *                 updated_at:  
 *                   type: string  
 *                   format: date-time  
 *                   description: The date and time when the application was last updated.  
 *                   example: "2025-01-20T06:49:00Z"  
 *       404:  
 *         description: Application not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that the application was not found.  
 *                   example: "Application not found"  
 *       500:  
 *         description: Failed to retrieve application  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve application"  
 */
const getApplication = async (req, res) => {
    const { application_id } = req.params;

    try {
        const application = await knex('applications').where({ application_id }).first();
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve application' });
    }
};

/**  
 * @swagger  
 * /api/application/applications/{application_id}:  
 *   put:  
 *     summary: Update an application by ID  
 *     description: This endpoint allows you to update the details of a specific application using its ID.  
 *     tags:  
 *       - Applications  
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to update.  
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
 *               status:  
 *                 type: string  
 *                 description: The new status of the application.  
 *                 example: "approved"  
 *               document_path:  
 *                 type: string  
 *                 description: The new path to the document associated with the application.  
 *                 example: "/documents/applications/1_updated.pdf"  
 *               hard_file_position:  
 *                 type: string  
 *                 description: The new physical location of the hard copy of the application.  
 *                 example: "File Room B"  
 *     responses:  
 *       200:  
 *         description: Application updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the application was updated.  
 *                   example: "Application updated successfully"  
 *       404:  
 *         description: Application not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that the application was not found.  
 *                   example: "Application not found"  
 *       500:  
 *         description: Failed to update application  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update application"  
 */
const updateApplication = async (req, res) => {
    const { application_id } = req.params;
    const { status, document_path, hard_file_position } = req.body;

    try {
        await knex('applications').where({ application_id }).update({
            status,
            document_path,
            hard_file_position,
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Application updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update application' });
    }
};

/**  
 * @swagger  
 * /api/application/applications/{application_id}:  
 *   delete:  
 *     summary: Soft delete an application by ID  
 *     description: This endpoint allows you to soft delete a specific application using its ID by setting the `deleted_at` timestamp.  
 *     tags:  
 *       - Applications  
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to delete.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Application deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the application was deleted.  
 *                   example: "Application deleted successfully"  
 *       404:  
 *         description: Application not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that the application was not found.  
 *                   example: "Application not found"  
 *       500:  
 *         description: Failed to delete application  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete application"  
 */
const deleteApplication = async (req, res) => {
    const { application_id } = req.params;

    try {
        await knex('applications').where({ application_id }).update({
            deleted_at: new Date(),
        });

        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete application' });
    }
};

/**  
 * @swagger  
 * /api/application/{application_id}/tasks:
 *   post:  
 *     summary: Create a new task  
 *     description: This endpoint allows you to create a new task associated with a specific application. You can also associate documents with the task.  
 *     tags:  
 *       - Tasks  
 *     parameters:
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
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
 *               application_id:  
 *                 type: integer  
 *                 description: The ID of the application to which the task is associated.  
 *                 example: 1  
 *               title:  
 *                 type: string  
 *                 description: The title of the task.  
 *                 example: "Review Application"  
 *               description:  
 *                 type: string  
 *                 description: A detailed description of the task.  
 *                 example: "Review the application documents and provide feedback."  
 *               due_date:  
 *                 type: string  
 *                 format: date-time  
 *                 description: The due date for the task in ISO 8601 format.  
 *                 example: "2025-01-30T12:00:00Z"  
 *               document_ids:  
 *                 type: array  
 *                 items:  
 *                   type: integer  
 *                 description: An array of document IDs to associate with the task.  
 *                 example: [1, 2, 3]  
 *     responses:  
 *       201:  
 *         description: Task created successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 task_id:  
 *                   type: integer  
 *                   description: The ID of the newly created task.  
 *                   example: 1  
 *       500:  
 *         description: Failed to create task  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to create task"  
 */
const createTask = async (req, res) => {
    const { application_id, title, description, due_date, document_ids } = req.body;

    try {
        const [task_id] = await knex('tasks').insert({
            application_id,
            title,
            description,
            status: 'Pending',
            due_date,
            created_at: new Date(),
            updated_at: new Date(),
        }).returning('task_id');

        // Associate documents with the task    
        if (document_ids && document_ids.length > 0) {
            const taskDocuments = document_ids.map(doc_id => ({
                task_id,
                document_id: doc_id,
                created_at: new Date(),
                updated_at: new Date(),
            }));
            await knex('task_documents').insert(taskDocuments);
        }

        res.status(201).json({ task_id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};


/**  
 * @swagger  
 * /api/application/{application_id}/tasks:
 *   get:  
 *     summary: Retrieve tasks for a specific application  
 *     description: This endpoint retrieves all tasks associated with a given application ID, including any associated document file paths.  
 *     tags:  
 *       - Tasks  
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application for which to retrieve tasks.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: A list of tasks associated with the application  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   task_id:  
 *                     type: integer  
 *                     description: The ID of the task.  
 *                     example: 1  
 *                   application_id:  
 *                     type: integer  
 *                     description: The ID of the associated application.  
 *                     example: 1  
 *                   title:  
 *                     type: string  
 *                     description: The title of the task.  
 *                     example: "Review Application"  
 *                   description:  
 *                     type: string  
 *                     description: A detailed description of the task.  
 *                     example: "Review the application documents and provide feedback."  
 *                   status:  
 *                     type: string  
 *                     description: The current status of the task.  
 *                     example: "Pending"  
 *                   due_date:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The due date for the task in ISO 8601 format.  
 *                     example: "2025-01-30T12:00:00Z"  
 *                   file_path:  
 *                     type: string  
 *                     description: The file path of the associated document, if any.  
 *                     example: "/documents/application_1.pdf"  
 *       404:  
 *         description: No tasks found for the specified application ID  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating no tasks were found.  
 *                   example: "No tasks found for the specified application ID"  
 *       500:  
 *         description: Failed to retrieve tasks  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve tasks"  
 */
const getTasks = async (req, res) => {
    const { application_id } = req.params;

    try {
        const tasks = await knex('tasks')
            .where({ application_id })
            .leftJoin('task_documents', 'tasks.task_id', 'task_documents.task_id')
            .leftJoin('documents', 'task_documents.document_id', 'documents.document_id')
            .select('tasks.*', 'documents.file_path') // Select task fields and document file path    
            .andWhere('tasks.deleted_at', null); // Assuming soft delete    

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};


/**  
 * @swagger  
 * /api/application/{application_id}/tasks/{task_id}/documents:
 *   get:  
 *     summary: Retrieve documents associated with a specific task  
 *     description: This endpoint retrieves all documents linked to a given task ID.  
 *     tags:  
 *       - Task Documents  
 *     parameters:
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: path  
 *         name: task_id  
 *         required: true  
 *         description: The ID of the task for which to retrieve associated documents.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: A list of documents associated with the task  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   document_id:  
 *                     type: integer  
 *                     description: The ID of the document.  
 *                     example: 1  
 *                   application_id:  
 *                     type: integer  
 *                     description: The ID of the associated application.  
 *                     example: 1  
 *                   file_path:  
 *                     type: string  
 *                     description: The file path of the document.  
 *                     example: "/documents/application_1.pdf"  
 *                   created_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The timestamp when the document was created.  
 *                     example: "2025-01-20T07:26:00Z"  
 *                   updated_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The timestamp when the document was last updated.  
 *                     example: "2025-01-20T07:26:00Z"  
 *       404:  
 *         description: No documents found for the specified task ID  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating no documents were found.  
 *                   example: "No documents found for the specified task ID"  
 *       500:  
 *         description: Failed to retrieve documents  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve documents for the task"  
 */
const getTaskDocuments = async (req, res) => {
    const { task_id } = req.params;

    try {
        const documents = await knex('task_documents')
            .where({ task_id })
            .leftJoin('documents', 'task_documents.document_id', 'documents.document_id')
            .select('documents.*');

        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve documents for the task' });
    }
};

/**  
 * @swagger  
 * /api/application/{application_id}/tasks/{task_id}/checklist:
 *   put:  
 *     summary: Update the completion status of a checklist item  
 *     description: This endpoint updates the completion status of a checklist item associated with a specific task ID.  
 *     tags:  
 *       - Checklist Items  
 *     parameters:
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: path  
 *         name: task_id  
 *         required: true  
 *         description: The ID of the task for which to update the checklist item.  
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
 *               is_completed:  
 *                 type: boolean  
 *                 description: The completion status of the checklist item.  
 *                 example: true  
 *     responses:  
 *       200:  
 *         description: Checklist item updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the checklist item was updated.  
 *                   example: "Checklist item updated successfully"  
 *       404:  
 *         description: Task not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the task was not found.  
 *                   example: "Task not found"  
 *       500:  
 *         description: Failed to update checklist item  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update checklist item"  
 */
const updateChecklistItem = async (req, res) => {
    const { task_id } = req.params;
    const { is_completed } = req.body;

    try {
        await knex('tasks').where({ task_id }).update({
            is_completed,
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Checklist item updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update checklist item' });
    }
};


// Function to get checklist items for a task  
/**  
 * @swagger  
 * /api/application/{application_id}/tasks/{task_id}/checklist:
 *   get:  
 *     summary: Retrieve checklist items for a task  
 *     description: This endpoint retrieves all checklist items associated with a specific task ID.  
 *     tags:  
 *       - Checklist Items  
 *     parameters:
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: path  
 *         name: task_id  
 *         required: true  
 *         description: The ID of the task for which to retrieve checklist items.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: A list of checklist items for the specified task  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   task_id:  
 *                     type: integer  
 *                     description: The ID of the task.  
 *                     example: 1  
 *                   title:  
 *                     type: string  
 *                     description: The title of the checklist item.  
 *                     example: "Checklist Item Title"  
 *                   description:  
 *                     type: string  
 *                     description: The description of the checklist item.  
 *                     example: "Description of the checklist item."  
 *                   is_completed:  
 *                     type: boolean  
 *                     description: The completion status of the checklist item.  
 *                     example: false  
 *                   created_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The date and time when the checklist item was created.  
 *                     example: "2025-01-20T07:28:00Z"  
 *                   updated_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The date and time when the checklist item was last updated.  
 *                     example: "2025-01-20T07:28:00Z"  
 *       404:  
 *         description: Task not found or no checklist items available  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the task was not found or no checklist items exist.  
 *                   example: "No checklist items found for the specified task"  
 *       500:  
 *         description: Failed to retrieve checklist items  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve checklist items"  
 */
const getChecklistItems = async (req, res) => {
    const { task_id } = req.params;

    try {
        const checklistItems = await knex('tasks')
            .where({ parent_id: task_id }) // Get subtasks for the given task    
            .andWhere('is_checklist', true) // Only get checklist items    
            .andWhere('deleted_at', null) // Assuming soft delete    
            .select('*');

        res.json(checklistItems);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve checklist items' });
    }
};


// Function to update a task or subtask  
/**  
 * @swagger  
 * /api/application/{application_id}/tasks/{task_id}:
 *   put:  
 *     summary: Update a task  
 *     description: This endpoint updates the details of a specific task identified by its task ID.  
 *     tags:  
 *       - Tasks  
 *     parameters:
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: path  
 *         name: task_id  
 *         required: true  
 *         description: The ID of the task to be updated.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: body  
 *         name: body  
 *         required: true  
 *         description: The details of the task to be updated.  
 *         schema:  
 *           type: object  
 *           properties:  
 *             title:  
 *               type: string  
 *               description: The title of the task.  
 *               example: "Updated Task Title"  
 *             description:  
 *               type: string  
 *               description: The description of the task.  
 *               example: "Updated description of the task."  
 *             status:  
 *               type: string  
 *               description: The current status of the task.  
 *               example: "In Progress"  
 *             due_date:  
 *               type: string  
 *               format: date-time  
 *               description: The due date for the task.  
 *               example: "2025-01-25T12:00:00Z"  
 *     responses:  
 *       200:  
 *         description: Task updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the task was updated.  
 *                   example: "Task updated successfully"  
 *       404:  
 *         description: Task not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the task was not found.  
 *                   example: "Task not found"  
 *       500:  
 *         description: Failed to update task  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update task"  
 */
const updateTask = async (req, res) => {
    const { task_id } = req.params;
    const { title, description, status, due_date } = req.body;

    try {
        await knex('tasks').where({ task_id }).update({
            title,
            description,
            status,
            due_date,
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};


// Function to delete a task or subtask (soft delete)  
/**  
 * @swagger  
 * /api/application/{application_id}/tasks/{task_id}:
 *   delete:  
 *     summary: Delete a task  
 *     description: This endpoint marks a specific task as deleted by setting the `deleted_at` timestamp.  
 *     tags:  
 *       - Tasks  
 *     parameters:
 *       parameters:
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: path  
 *         name: task_id  
 *         required: true  
 *         description: The ID of the task to be deleted.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Task deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the task was deleted.  
 *                   example: "Task deleted successfully"  
 *       404:  
 *         description: Task not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the task was not found.  
 *                   example: "Task not found"  
 *       500:  
 *         description: Failed to delete task  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete task"  
 */
const deleteTask = async (req, res) => {
    const { task_id } = req.params;

    try {
        await knex('tasks').where({ task_id }).update({
            deleted_at: new Date(),
        });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

/**  
 * @swagger  
 * /api/application/applications/{application_id}/submit:
 *   put:  
 *     summary: Submit application to manager  
 *     description: This endpoint updates the status of a specific application to "Submitted to Manager".  
 *     tags:  
 *       - Applications  
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to be submitted to the manager.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Application submitted to manager successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the application was submitted.  
 *                   example: "Application submitted to manager"  
 *       404:  
 *         description: Application not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the application was not found.  
 *                   example: "Application not found"  
 *       500:  
 *         description: Failed to submit application to manager  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to submit application to manager"  
 */
const submitToManager = async (req, res) => {
    const { application_id } = req.params;

    try {
        await knex('applications').where({ application_id }).update({
            status: 'Submitted to Manager',
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Application submitted to manager' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit application to manager' });
    }
};


/**  
 * @swagger  
 * /api/application/teams/{team_id}/tasks:  
 *   get:  
 *     summary: Get tasks by team  
 *     description: This endpoint retrieves all tasks assigned to a specific team based on the team ID.  
 *     tags:  
 *       - Teams  
 *     parameters:  
 *       - in: path  
 *         name: team_id  
 *         required: true  
 *         description: The ID of the team for which to retrieve tasks.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: A list of tasks assigned to the specified team  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   task_id:  
 *                     type: integer  
 *                     description: The ID of the task.  
 *                     example: 1  
 *                   title:  
 *                     type: string  
 *                     description: The title of the task.  
 *                     example: "Complete project report"  
 *                   description:  
 *                     type: string  
 *                     description: The description of the task.  
 *                     example: "Prepare the final report for the project."  
 *                   status:  
 *                     type: string  
 *                     description: The current status of the task.  
 *                     example: "In Progress"  
 *                   due_date:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The due date of the task.  
 *                     example: "2025-01-30T12:00:00Z"  
 *                   assigned_to:  
 *                     type: integer  
 *                     description: The ID of the user the task is assigned to.  
 *                     example: 2  
 *       404:  
 *         description: No tasks found for the specified team  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating no tasks were found.  
 *                   example: "No tasks found for the specified team"  
 *       500:  
 *         description: Failed to retrieve tasks  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve tasks"  
 */
const getTasksByTeam = async (req, res) => {
    const { team_id } = req.params;

    try {
        const tasks = await knex('tasks')
            .join('subtasks', 'tasks.task_id', '=', 'subtasks.task_id')
            .where('subtasks.assigned_to', team_id)
            .select('tasks.*', 'subtasks.*');

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};


/**  
 * @swagger  
 * /api/application/{application_id}/tasks/{tasks_id}/pick:
 *   put:  
 *     summary: Pick a subtask  
 *     description: This endpoint allows a team member to pick a subtask and assign it to themselves.  
 *     tags:  
 *       - Subtasks  
 *     parameters:  
 *       - in: path  
 *         name: subtask_id  
 *         required: true  
 *         description: The ID of the subtask to be picked.  
 *         schema:  
 *           type: integer  
 *           example: 1 
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
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
 *               member_id:  
 *                 type: integer  
 *                 description: The ID of the team member picking the subtask.  
 *                 example: 2  
 *     responses:  
 *       200:  
 *         description: Subtask picked successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message.  
 *                   example: "Subtask picked successfully"  
 *       404:  
 *         description: Subtask not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the subtask was not found.  
 *                   example: "Subtask not found"  
 *       500:  
 *         description: Failed to pick subtask  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to pick subtask"  
 */
const pickTask = async (req, res) => {
    const { task_id } = req.params;
    const { member_id } = req.body;

    try {
        await knex('subtasks').where({ task_id }).update({
            assigned_to: member_id,
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Subtask picked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to pick subtask' });
    }
};


/**  
 * @swagger  
 * /api/application/applications/{application_id}/handover:  
 *   put:  
 *     summary: Handover application to client  
 *     description: This endpoint allows the application status to be updated to "Handover to Client".  
 *     tags:  
 *       - Applications  
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to be handed over.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Application handed over to client successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message.  
 *                   example: "Application handed over to client"  
 *       404:  
 *         description: Application not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the application was not found.  
 *                   example: "Application not found"  
 *       500:  
 *         description: Failed to hand over application  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to hand over application"  
 */
const handoverToClient = async (req, res) => {
    const { application_id } = req.params;

    try {
        await knex('applications').where({ application_id }).update({
            status: 'Handover to Client',
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Application handed over to client' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to hand over application' });
    }
};


/**  
 * @swagger  
 * /api/application/clients/{client_id}:
 *   get:  
 *     summary: Check progress of applications for a client  
 *     description: This endpoint retrieves all applications associated with a specific client to check their progress.  
 *     tags:  
 *       - Applications  
 *     parameters:  
 *       - in: path  
 *         name: client_id  
 *         required: true  
 *         description: The ID of the client whose applications are being checked.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: Successfully retrieved applications for the client  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: array  
 *               items:  
 *                 type: object  
 *                 properties:  
 *                   application_id:  
 *                     type: integer  
 *                     description: The ID of the application.  
 *                     example: 1  
 *                   client_id:  
 *                     type: integer  
 *                     description: The ID of the client.  
 *                     example: 1  
 *                   status:  
 *                     type: string  
 *                     description: The current status of the application.  
 *                     example: "In Progress"  
 *                   submitted_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The date and time when the application was submitted.  
 *                     example: "2025-01-20T07:32:00Z"  
 *                   updated_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The date and time when the application was last updated.  
 *                     example: "2025-01-20T07:32:00Z"  
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
 *         description: Failed to check progress  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to check progress"  
 */
const checkProgress = async (req, res) => {
    const { client_id } = req.params;

    try {
        const applications = await knex('applications').where({ client_id }).select('*');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to check progress' });
    }
};


/**  
 * @swagger  
 * /api/application/{application_id}/tasks/assign:
 *   post:  
 *     summary: Assign a task to a team  
 *     description: This endpoint assigns a specified task to a team by updating the task's team_id.  
 *     tags:  
 *       - Tasks
 *     parameters:  
 *       - in: path  
 *         name: application_id  
 *         required: true  
 *         description: The ID of the application to retrieve.  
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
 *               task_id:  
 *                 type: integer  
 *                 description: The ID of the task to be assigned.  
 *                 example: 1  
 *               team_id:  
 *                 type: integer  
 *                 description: The ID of the team to which the task will be assigned.  
 *                 example: 2  
 *     responses:  
 *       200:  
 *         description: Task assigned to team successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the task was assigned.  
 *                   example: "Task assigned to team successfully"  
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
 *                   example: "Missing task_id or team_id"  
 *       500:  
 *         description: Failed to assign task to team  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to assign task to team"  
 */
const assignTaskToTeam = async (req, res) => {
    const { task_id, team_id } = req.body;

    try {
        await knex('tasks').where({ task_id }).update({
            team_id,
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'Task assigned to team successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to assign task to team' });
    }
};


module.exports = {
    createApplication,
    getApplication,
    updateApplication,
    deleteApplication,
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    submitToManager,
    getTasksByTeam,
    pickTask,
    updateTask,
    handoverToClient,
    checkProgress,
    assignTaskToTeam,
    updateChecklistItem,
    getChecklistItems,
    getTaskDocuments,
};  

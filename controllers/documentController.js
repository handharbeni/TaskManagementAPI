const knex = require('../db');
const path = require('path');
const fs = require('fs');

/**  
 * @swagger  
 * /documents:  
 *   post:  
 *     summary: Upload a file associated with an application  
 *     description: This endpoint allows users to upload a file for a specific application. The file will be stored, and a record will be created in the documents table.  
 *     tags:  
 *       - Documents  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         multipart/form-data:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               application_id:  
 *                 type: integer  
 *                 description: The ID of the application to which the file is associated.  
 *                 example: 1  
 *               hard_file_position:  
 *                 type: string  
 *                 description: The position of the file in the hard copy storage.  
 *                 example: "Shelf A, Row 3"  
 *               file:  
 *                 type: string  
 *                 format: binary  
 *                 description: The file to upload.  
 *     responses:  
 *       201:  
 *         description: File uploaded successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 document_id:  
 *                   type: integer  
 *                   description: The ID of the newly created document record.  
 *                   example: 1  
 *       400:  
 *         description: No file uploaded  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that no file was uploaded.  
 *                   example: "No file uploaded"  
 *       500:  
 *         description: Failed to upload file  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to upload file"  
 */  
const uploadFile = async (req, res) => {  
    const { application_id } = req.body;  
    const file = req.file; // Assuming you're using multer for file uploads    
  
    if (!file) {  
        return res.status(400).json({ error: 'No file uploaded' });  
    }  
  
    const filePath = path.join(__dirname, '../uploads', file.filename); // Adjust the path as needed    
  
    try {  
        const [document_id] = await knex('documents').insert({  
            application_id,  
            file_path: filePath,  
            hard_file_position: req.body.hard_file_position,  
            created_at: new Date(),  
            updated_at: new Date(),  
        }).returning('document_id');  
  
        res.status(201).json({ document_id });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to upload file' });  
    }  
};  


/**  
 * @swagger  
 * /documents/{document_id}:  
 *   get:  
 *     summary: Retrieve a file associated with a document  
 *     description: This endpoint allows users to retrieve a file based on its document ID. The file will be sent as a response.  
 *     tags:  
 *       - Documents  
 *     parameters:  
 *       - name: document_id  
 *         in: path  
 *         required: true  
 *         description: The ID of the document to retrieve.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: File retrieved successfully  
 *       404:  
 *         description: Document not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that the document was not found.  
 *                   example: "Document not found"  
 *       500:  
 *         description: Failed to retrieve file  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to retrieve file"  
 */  
const getFile = async (req, res) => {  
    const { document_id } = req.params;  
  
    try {  
        const document = await knex('documents').where({ document_id }).first();  
        if (!document) {  
            return res.status(404).json({ error: 'Document not found' });  
        }  
        res.sendFile(document.file_path);  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to retrieve file' });  
    }  
};  


/**  
 * @swagger  
 * /documents/{document_id}:  
 *   put:  
 *     summary: Update a file associated with a document  
 *     description: This endpoint allows users to update the file associated with a specific document ID. The new file will replace the existing one.  
 *     tags:  
 *       - Documents  
 *     parameters:  
 *       - name: document_id  
 *         in: path  
 *         required: true  
 *         description: The ID of the document to update.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *       - name: file  
 *         in: formData  
 *         required: true  
 *         description: The new file to upload.  
 *         type: file  
 *     responses:  
 *       200:  
 *         description: File updated successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the file was updated.  
 *                   example: "File updated successfully"  
 *       400:  
 *         description: No file uploaded  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that no file was uploaded.  
 *                   example: "No file uploaded"  
 *       500:  
 *         description: Failed to update file  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to update file"  
 */  
const updateFile = async (req, res) => {  
    const { document_id } = req.params;  
    const file = req.file;  
  
    if (!file) {  
        return res.status(400).json({ error: 'No file uploaded' });  
    }  
  
    const filePath = path.join(__dirname, '../uploads', file.filename);  
  
    try {  
        await knex('documents').where({ document_id }).update({  
            file_path: filePath,  
            updated_at: new Date(),  
        });  
  
        res.status(200).json({ message: 'File updated successfully' });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to update file' });  
    }  
};  


/**  
 * @swagger  
 * /documents/{document_id}:  
 *   delete:  
 *     summary: Delete a file associated with a document  
 *     description: This endpoint allows users to delete a file associated with a specific document ID. It also removes the file from the filesystem if it exists.  
 *     tags:  
 *       - Documents  
 *     parameters:  
 *       - name: document_id  
 *         in: path  
 *         required: true  
 *         description: The ID of the document to delete.  
 *         schema:  
 *           type: integer  
 *           example: 1  
 *     responses:  
 *       200:  
 *         description: File deleted successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 message:  
 *                   type: string  
 *                   description: Success message indicating the file was deleted.  
 *                   example: "File deleted successfully"  
 *       404:  
 *         description: Document not found  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that the document was not found.  
 *                   example: "Document not found"  
 *       500:  
 *         description: Failed to delete file  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to delete file"  
 */  
const deleteFile = async (req, res) => {  
    const { document_id } = req.params;  
  
    try {  
        const document = await knex('documents').where({ document_id }).first();  
        if (!document) {  
            return res.status(404).json({ error: 'Document not found' });  
        }  
  
        // Optionally delete the file from the filesystem    
        fs.unlinkSync(document.file_path);  
  
        await knex('documents').where({ document_id }).update({  
            deleted_at: new Date(),  
        });  
  
        res.status(200).json({ message: 'File deleted successfully' });  
    } catch (error) {  
        res.status(500).json({ error: 'Failed to delete file' });  
    }  
};  


/**  
 * @swagger  
 * /documents:  
 *   post:  
 *     summary: Upload a document associated with an application  
 *     description: This endpoint allows users to upload a document and associate it with a specific application ID.  
 *     tags:  
 *       - Documents  
 *     requestBody:  
 *       required: true  
 *       content:  
 *         application/json:  
 *           schema:  
 *             type: object  
 *             properties:  
 *               application_id:  
 *                 type: integer  
 *                 description: The ID of the application to associate the document with.  
 *                 example: 1  
 *     responses:  
 *       201:  
 *         description: Document uploaded successfully  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 document_id:  
 *                   type: integer  
 *                   description: The ID of the newly created document.  
 *                   example: 1  
 *                 file_path:  
 *                   type: string  
 *                   description: The path where the uploaded file is stored.  
 *                   example: "/uploads/document.pdf"  
 *       400:  
 *         description: No file uploaded  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that no file was uploaded.  
 *                   example: "No file uploaded"  
 *       500:  
 *         description: Failed to upload document  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating the failure reason.  
 *                   example: "Failed to upload document"  
 */  
const uploadDocument = async (req, res) => {    
    const { application_id } = req.body; // Assuming you want to associate the document with an application    
    const file = req.file;    
    
    if (!file) {    
        return res.status(400).json({ error: 'No file uploaded' });    
    }    
    
    try {    
        const document = {    
            application_id,    
            file_path: file.path, // Save the file path in the database    
            created_at: new Date(),    
            updated_at: new Date(),    
        };    
    
        const [document_id] = await knex('documents').insert(document).returning('document_id');    
    
        res.status(201).json({ document_id, file_path: file.path });    
    } catch (error) {    
        res.status(500).json({ error: 'Failed to upload document' });    
    }    
};  
 
  
// Function to get documents for a specific task  
/**  
 * @swagger  
 * /tasks/{task_id}/documents:  
 *   get:  
 *     summary: Retrieve documents associated with a specific task  
 *     description: This endpoint retrieves all documents linked to a given task ID.  
 *     tags:  
 *       - Documents  
 *     parameters:  
 *       - in: path  
 *         name: task_id  
 *         required: true  
 *         description: The ID of the task for which to retrieve documents.  
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
 *                     description: The ID of the application associated with the document.  
 *                     example: 1  
 *                   file_path:  
 *                     type: string  
 *                     description: The path where the document is stored.  
 *                     example: "/uploads/document.pdf"  
 *                   created_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The date and time when the document was created.  
 *                     example: "2025-01-20T07:39:00Z"  
 *                   updated_at:  
 *                     type: string  
 *                     format: date-time  
 *                     description: The date and time when the document was last updated.  
 *                     example: "2025-01-20T07:39:00Z"  
 *       404:  
 *         description: No documents found for the specified task ID  
 *         content:  
 *           application/json:  
 *             schema:  
 *               type: object  
 *               properties:  
 *                 error:  
 *                   type: string  
 *                   description: Error message indicating that no documents were found.  
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
 *                   example: "Failed to retrieve documents"  
 */  
const getTaskDocuments = async (req, res) => {    
    const { task_id } = req.params;    
    
    try {    
        const documents = await knex('documents').where({ task_id });    
    
        res.status(200).json(documents);    
    } catch (error) {    
        res.status(500).json({ error: 'Failed to retrieve documents' });    
    }    
};  


module.exports = {
    uploadFile,
    getFile,
    updateFile,
    deleteFile,
    uploadDocument,  
    getTaskDocuments,    
};  

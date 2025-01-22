const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const applicationController = require('../controllers/applicationController');
const reportController = require('../controllers/reportController');
const documentController = require('../controllers/documentController');
const clientController = require('../controllers/clientController');
const accountController = require('../controllers/accountController');
const rbacMiddleware = require('../middleware/rbacMiddleware');
const upload = require('../middleware/upload');

// User management routes  
router.post('/users/register', userController.registerUser);
router.post('/users/member', rbacMiddleware(['Admin']), userController.createMember);
router.post('/users/admin', rbacMiddleware(['Admin']), userController.createAdmin);
router.post('/users/manager', rbacMiddleware(['Admin']), userController.createManager);
router.post('/users/notaris', rbacMiddleware(['Admin']), userController.createNotaris);
router.post('/users/reset-password', rbacMiddleware(['Admin', 'Manager']), userController.resetPassword);
router.post('/users/login', userController.login);

router.post('/application/applications', rbacMiddleware(['Admin']), applicationController.createApplication);
router.get('/application/applications/:application_id', rbacMiddleware(['Admin']), applicationController.getApplication);
router.put('/application/applications/:application_id', rbacMiddleware(['Admin']), applicationController.updateApplication);
router.delete('/application/applications/:application_id', rbacMiddleware(['Admin']), applicationController.deleteApplication);
router.post('/application/:application_id/tasks', rbacMiddleware(['Manager', 'Admin']), applicationController.createTask);
router.get('/application/:application_id/tasks', rbacMiddleware(['Manager', 'Admin']), applicationController.getTasks);
router.get('/application/:application_id/tasks/:task_id/documents', rbacMiddleware(['Member', 'Admin', 'Manager']), applicationController.getTaskDocuments);
router.put('/application/:application_id/tasks/:task_id/checklist', rbacMiddleware(['Member', 'Admin', 'Manager']), applicationController.updateChecklistItem);
router.get('/application/:application_id/tasks/:task_id/checklist', rbacMiddleware(['Member', 'Admin', 'Manager']), applicationController.getChecklistItems);
router.put('/application/:application_id/tasks/:task_id', rbacMiddleware(['Manager', 'Admin']), applicationController.updateTask);
router.delete('/application/:application_id/tasks/:task_id', rbacMiddleware(['Manager', 'Admin']), applicationController.updateTask);
router.put('/application/applications/:application_id/submit', rbacMiddleware(['Admin']), applicationController.submitToManager);
router.get('/application/teams/:team_id/tasks', rbacMiddleware(['Member']), applicationController.getTasksByTeam);
router.put('/application/:application_id/tasks/:tasks_id/pick', rbacMiddleware(['Member']), applicationController.pickTask);
router.put('/application/applications/:application_id/handover', rbacMiddleware(['Admin']), applicationController.handoverToClient);
router.get('/application/clients/:client_id', rbacMiddleware(['Admin', 'Manager', 'Member']), applicationController.checkProgress);
router.post('/application/:application_id/tasks/assign', rbacMiddleware(['Admin', 'Manager', 'Member']), applicationController.assignTaskToTeam);


router.post('/tasks', rbacMiddleware(['Admin', 'Manager']), applicationController.createTask);
router.get('/applications/:application_id/tasks', rbacMiddleware(['Admin', 'Manager', 'Member']), applicationController.getTasks);
router.put('/tasks/:task_id', rbacMiddleware(['Admin', 'Manager']), applicationController.updateTask);
router.delete('/tasks/:task_id', rbacMiddleware(['Admin']), applicationController.deleteTask);
router.get('/tasks/:task_id/documents', applicationController.getTaskDocuments);

router.post('/documents/upload', upload.single('document'), documentController.uploadDocument);
  
router.put('/tasks/:task_id/checklist', applicationController.updateChecklistItem);
router.get('/tasks/:task_id/checklist', applicationController.getChecklistItems);
router.get('/tasks/:task_id/documents', documentController.getTaskDocuments);

// Report routes  
router.get('/reports/member', rbacMiddleware(['Admin', 'Manager']), reportController.reportMember);
router.get('/reports/team', rbacMiddleware(['Admin', 'Manager']), reportController.reportTeam);
router.get('/reports/application-type', rbacMiddleware(['Admin', 'Manager']), reportController.reportApplicationType);
router.get('/reports/successful-applications', rbacMiddleware(['Admin', 'Manager']), reportController.reportSuccessfulApplications);

router.post('/clients', clientController.createClient);  
router.get('/clients', clientController.getClients);  
router.get('/clients/:client_id', clientController.getClientById);  
router.put('/clients/:client_id', clientController.updateClient);  
router.delete('/clients/:client_id', clientController.deleteClient);

router.post('/account/register', accountController.register);  
router.post('/account/login', accountController.login);  
router.post('/account/forgot-password', accountController.forgotPassword);  
router.delete('/account/:client_id', accountController.deleteAccount); 

module.exports = router;  

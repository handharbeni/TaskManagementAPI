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
router.post('/api/users/register', userController.registerUser);
router.post('/api/users/member', rbacMiddleware(['Admin']), userController.createMember);
router.post('/api/users/admin', rbacMiddleware(['Admin']), userController.createAdmin);
router.post('/api/users/manager', rbacMiddleware(['Admin']), userController.createManager);
router.post('/api/users/notaris', rbacMiddleware(['Admin']), userController.createNotaris);
router.post('/api/users/reset-password', rbacMiddleware(['Admin', 'Manager']), userController.resetPassword);
router.post('/api/users/reset-password', userController.login);

router.post('/api/application/applications', rbacMiddleware(['Admin']), applicationController.createApplication);
router.get('/api/application/applications/:application_id', rbacMiddleware(['Admin']), applicationController.getApplication);
router.put('/api/application/applications/:application_id', rbacMiddleware(['Admin']), applicationController.updateApplication);
router.delete('/api/application/applications/:application_id', rbacMiddleware(['Admin']), applicationController.deleteApplication);
router.post('/api/application/:application_id/tasks', rbacMiddleware(['Manager', 'Admin']), applicationController.createTask);
router.get('/api/application/:application_id/tasks', rbacMiddleware(['Manager', 'Admin']), applicationController.getTasks);
router.get('/api/application/:application_id/tasks/:task_id/documents', rbacMiddleware(['Member', 'Admin', 'Manager']), applicationController.getTaskDocuments);
router.put('/api/application/:application_id/tasks/:task_id/checklist', rbacMiddleware(['Member', 'Admin', 'Manager']), applicationController.updateChecklistItem);
router.get('/api/application/:application_id/tasks/:task_id/checklist', rbacMiddleware(['Member', 'Admin', 'Manager']), applicationController.getChecklistItems);
router.put('/api/application/:application_id/tasks/:task_id', rbacMiddleware(['Manager', 'Admin']), applicationController.updateTask);
router.delete('/api/application/:application_id/tasks/:task_id', rbacMiddleware(['Manager', 'Admin']), applicationController.updateTask);
router.put('/api/application/applications/:application_id/submit', rbacMiddleware(['Admin']), applicationController.submitToManager);
router.get('/api/application/teams/:team_id/tasks', rbacMiddleware(['Member']), applicationController.getTasksByTeam);
router.put('/api/application/:application_id/tasks/:tasks_id/pick', rbacMiddleware(['Member']), applicationController.pickTask);
router.put('/api/application/applications/:application_id/handover', rbacMiddleware(['Admin']), applicationController.handoverToClient);
router.get('/api/application/clients/:client_id', rbacMiddleware(['Admin', 'Manager', 'Member']), applicationController.checkProgress);
router.post('/api/application/:application_id/tasks/assign', rbacMiddleware(['Admin', 'Manager', 'Member']), applicationController.assignTaskToTeam);


router.post('/api/tasks', rbacMiddleware(['Admin', 'Manager']), applicationController.createTask);
router.get('/api/applications/:application_id/tasks', rbacMiddleware(['Admin', 'Manager', 'Member']), applicationController.getTasks);
router.put('/api/tasks/:task_id', rbacMiddleware(['Admin', 'Manager']), applicationController.updateTask);
router.delete('/api/tasks/:task_id', rbacMiddleware(['Admin']), applicationController.deleteTask);
router.get('/api/tasks/:task_id/documents', applicationController.getTaskDocuments);

router.post('/api/documents/upload', upload.single('document'), documentController.uploadDocument);
  
router.put('/api/tasks/:task_id/checklist', applicationController.updateChecklistItem);
router.get('/api/tasks/:task_id/checklist', applicationController.getChecklistItems);
router.get('/api/tasks/:task_id/documents', documentController.getTaskDocuments);

// Report routes  
router.get('/api/reports/member', rbacMiddleware(['Admin', 'Manager']), reportController.reportMember);
router.get('/api/reports/team', rbacMiddleware(['Admin', 'Manager']), reportController.reportTeam);
router.get('/api/reports/application-type', rbacMiddleware(['Admin', 'Manager']), reportController.reportApplicationType);
router.get('/api/reports/successful-applications', rbacMiddleware(['Admin', 'Manager']), reportController.reportSuccessfulApplications);

router.post('/api/clients', clientController.createClient);  
router.get('/api/clients', clientController.getClients);  
router.get('/api/clients/:client_id', clientController.getClientById);  
router.put('/api/clients/:client_id', clientController.updateClient);  
router.delete('/api/clients/:client_id', clientController.deleteClient);

router.post('/account/register', accountController.register);  
router.post('/account/login', accountController.login);  
router.post('/account/forgot-password', accountController.forgotPassword);  
router.delete('/account/:client_id', accountController.deleteAccount); 

module.exports = router;  

// models/client.js  
const knex = require('../db');

const Client = {
    getAll: () => knex('clients'),
    getById: (clientId) => knex('clients').where('client_id', clientId).first(),
    create: (clientData) => knex('clients').insert(clientData).returning('*'),
    update: (clientId, clientData) => knex('clients').where('client_id', clientId).update(clientData).returning('*'),
    delete: (clientId) => knex('clients').where('client_id', clientId).del()
};

module.exports = Client;  

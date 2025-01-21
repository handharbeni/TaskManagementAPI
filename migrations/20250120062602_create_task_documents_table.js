exports.up = function (knex) {
    return knex.schema.createTable('task_documents', function (table) {
        table.increments('id').primary();
        table.integer('task_id').unsigned().references('task_id').inTable('tasks').onDelete('CASCADE');
        table.integer('document_id').unsigned().references('document_id').inTable('documents').onDelete('CASCADE');
        table.timestamps(true, true); // created_at and updated_at  
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('task_documents');
};  

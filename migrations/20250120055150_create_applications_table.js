exports.up = function (knex) {
    return knex.schema.createTable('applications', function (table) {
        table.increments('application_id').primary();
        table.integer('client_id').unsigned().references('client_id').inTable('clients').onDelete('CASCADE');
        table.timestamp('submitted_at').defaultTo(knex.fn.now());
        table.string('status'); // e.g., Pending, Approved, Rejected  
        table.string('document_path');
        table.string('hard_file_position');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('applications');
};  
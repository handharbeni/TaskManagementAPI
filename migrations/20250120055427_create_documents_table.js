exports.up = function (knex) {
    return knex.schema.createTable('documents', function (table) {
        table.increments('document_id').primary();
        table.integer('application_id').unsigned().references('application_id').inTable('applications').onDelete('CASCADE');
        table.string('file_path').notNullable();
        table.string('hard_file_position');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('documents');
};  
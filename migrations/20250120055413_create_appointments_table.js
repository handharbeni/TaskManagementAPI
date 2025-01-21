exports.up = function (knex) {
    return knex.schema.createTable('appointments', function (table) {
        table.increments('appointment_id').primary();
        table.integer('client_id').unsigned().references('client_id').inTable('clients').onDelete('CASCADE');
        table.integer('user_id').unsigned().references('user_id').inTable('users').onDelete('SET NULL');
        table.timestamp('appointment_time').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('appointments');
}; 
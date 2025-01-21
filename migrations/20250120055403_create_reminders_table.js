exports.up = function (knex) {
    return knex.schema.createTable('reminders', function (table) {
        table.increments('reminder_id').primary();
        table.integer('subtask_id').unsigned().references('subtask_id').inTable('subtasks').onDelete('CASCADE');
        table.timestamp('reminder_time').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('reminders');
};  
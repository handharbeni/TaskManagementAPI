exports.up = function (knex) {
    return knex.schema.createTable('tasks', function (table) {
        table.increments('task_id').primary();
        table.integer('application_id').unsigned().references('application_id').inTable('applications').onDelete('CASCADE');
        table.string('title').notNullable();
        table.text('description');
        table.enu('status', ['Pending', 'In Progress', 'Completed']).notNullable();
        table.timestamp('due_date');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('tasks');
};  
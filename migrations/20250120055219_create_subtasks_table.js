exports.up = function (knex) {
    return knex.schema.createTable('subtasks', function (table) {
        table.increments('subtask_id').primary();
        table.integer('task_id').unsigned().references('task_id').inTable('tasks').onDelete('CASCADE');
        table.string('title').notNullable();
        table.text('description');
        table.integer('assigned_to').unsigned().references('user_id').inTable('users').onDelete('SET NULL');
        table.enu('status', ['Pending', 'In Progress', 'Completed']).notNullable();
        table.timestamp('due_date');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('subtasks');
};  
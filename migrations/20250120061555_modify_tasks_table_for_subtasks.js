exports.up = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.integer('parent_id').unsigned().references('task_id').inTable('tasks').onDelete('CASCADE').nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.dropColumn('parent_id');
    });
};  

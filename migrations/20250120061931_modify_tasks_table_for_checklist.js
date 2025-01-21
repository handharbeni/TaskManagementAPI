exports.up = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.boolean('is_checklist').defaultTo(false); // Indicates if the task is a checklist item  
        table.boolean('is_completed').defaultTo(false); // Indicates if the checklist item is completed  
    });
};

exports.down = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.dropColumn('is_checklist');
        table.dropColumn('is_completed');
    });
};  

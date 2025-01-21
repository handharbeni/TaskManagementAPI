exports.up = function (knex) {
    return knex.schema.table('reminders', function (table) {
        table.boolean('sent').defaultTo(false);
    });
};

exports.down = function (knex) {
    return knex.schema.table('reminders', function (table) {
        table.dropColumn('sent');
    });
};  

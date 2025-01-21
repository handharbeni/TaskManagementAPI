exports.up = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.integer('team_id').unsigned().references('team_id').inTable('teams').onDelete('SET NULL');
    });
};

exports.down = function (knex) {
    return knex.schema.table('tasks', function (table) {
        table.dropColumn('team_id');
    });
};  

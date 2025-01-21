exports.up = function (knex) {
    return knex.schema.createTable('teams', function (table) {
        table.increments('team_id').primary();
        table.string('name').notNullable();
        table.integer('manager_id').unsigned().references('user_id').inTable('users').onDelete('SET NULL');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('teams');
};  
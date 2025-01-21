exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments('user_id').primary();
        table.string('username').unique().notNullable();
        table.string('email').unique().notNullable();
        table.string('password_hash').notNullable();
        table.enu('role', ['SuperAdmin', 'Admin', 'Manager', 'Member']).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};  
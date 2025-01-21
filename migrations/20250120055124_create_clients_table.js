exports.up = function (knex) {
    return knex.schema.createTable('clients', function (table) {
        table.increments('client_id').primary();
        table.string('name').notNullable();
        table.string('email').unique().notNullable();
        table.string('phone');
        table.string('address');
        table.string('password_hash').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.timestamp('deleted_at');
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('clients');
};  
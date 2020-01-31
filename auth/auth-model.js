const db = require('../database/dbConfig')

function find() {
    return db('users').select('id','username')
}

function findBy(filter) {
    return db('users')
        .where(filter)
}

async function add(user) {
    let ids = await db('users')
        .insert(user, 'id');
    const [id] = ids;
    return findById(id);
}

function findById(id) {
    return db('users')
        .select('id','username','password')
        .where({ id })
        .first();
}

module.exports = {
    add,
    find,
    findBy,
    findById
}
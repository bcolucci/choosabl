const mysql = require('mysql2/promise')
const { readFileSync } = require('fs')

const database = process.env.GCP_PROJECT.replace(/\-/g, '_')

const sslPath = __dirname + '/../../ssl/' + database

const auth = {
  choosabl_test_71670: {
    host: '35.242.152.87',
    password: 'athBDGIpHCj6qE6z'
  },
  choosabl_4a2ec: {
    host: '35.225.124.96',
    password: 'BbPsDAG53LqjEiL1'
  }
}

const options = {
  user: 'root',
  database,
  ...auth[database],
  ssl: {
    ca: readFileSync(sslPath + '/server-ca.pem'),
    key: readFileSync(sslPath + '/client-key.pem'),
    cert: readFileSync(sslPath + '/client-cert.pem')
  }
}

const createConnection = () => mysql.createConnection(options)

const query = async (sql, values = null) => {
  const conn = await createConnection()
  const [rows] = await conn.query(sql, values)
  conn.close()
  return rows
}

const queryFirst = async (sql, values = null) => {
  const rows = await query(sql, values)
  return rows.shift()
}

const queryFirstScalar = async (sql, values = null) => {
  const row = await queryFirst(sql, values)
  const res = Object.values(row).shift()
  return res
}

const insert = async (table, obj) => {
  const fields = Object.keys(obj)
  const values = Object.values(obj)
  const sql = `
    INSERT INTO ${table}
      (${fields.join(',')})
    VALUES
      (${'?'
    .repeat(fields.length)
    .split('')
    .join(',')})
  `
  const conn = await createConnection()
  const res = await conn.execute(sql, values)
  conn.close()
  return res
}

const qmarkSet = f => f + '=?'
const mapToQmark = obj => Object.keys(obj).map(qmarkSet)

const update = async (table, updates, ids) => {
  const values = [...Object.values(updates), ...Object.values(ids)]
  const sql = `
    UPDATE ${table}
    SET ${mapToQmark(updates).join(',')}
    WHERE ${mapToQmark(ids).join(',')}
  `
  const conn = await createConnection()
  const res = await conn.execute(sql, values)
  conn.close()
  return res
}

const _delete = async (table, ids) => {
  const sql = `DELETE FROM ${table} WHERE ${mapToQmark(ids).join(',')}`
  const conn = await createConnection()
  const res = await conn.execute(sql, Object.values(ids))
  conn.close()
  return res
}

module.exports = {
  createConnection,
  query,
  queryFirst,
  queryFirstScalar,
  insert,
  update,
  delete: _delete
}

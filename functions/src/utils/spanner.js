const { Spanner } = require('@google-cloud/spanner')

const projectId = process.env.GCP_PROJECT
const instanceId = projectId

const spanner = new Spanner({ projectId })

const instance = spanner.instance(instanceId)
const database = instance.database('main')

require('../collections').forEach(table => {
  // ugly
  global[`${table}Table`] = {
    findOne: id =>
      database
        .run({
          sql: `SELECT * FROM ${table} WHERE id = @id`,
          params: { id },
          json: true
        })
        .then(first)
  }
})

module.exports = database

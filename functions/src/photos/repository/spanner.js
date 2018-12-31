const uuid = require('uuid/v4')
const DB = require('../../utils/spanner')

const create = async ({ userUID, photo }) => {
  const now = new Date()
  const doc = {
    id: uuid(),
    user: userUID,
    ...photo,
    createdAt: now,
    updatedAt: now
  }
  await DB.table('photos').insert([doc])
  return doc
}

const remove = photoUID => DB.table('photos').deleteRows([photoUID])

const findUserUsedPhotoUIDs = userUID =>
  DB.run({
    sql: 'SELECT photo1, photo2 FROM battles WHERE user = @userUID',
    params: {
      userUID
    },
    json: true
  })
    .then(all)
    .then(rows =>
      rows
        .reduce((acc, { photo1, photo2 }) => [...acc, photo1, photo2], [])
        .filter(unique)
    )
    .then(photoUIDs =>
      DB.run({
        sql: 'SELECT id FROM photos WHERE id IN UNNEST (@photoUIDs)',
        params: { photoUIDs },
        types: {
          photoUIDs: {
            type: 'array',
            child: 'string'
          }
        },
        json: true
      })
    )
    .then(all)
    .then(rows => rows.map(({ id }) => id))

const findByUser = userUID =>
  findUserUsedPhotoUIDs(userUID).then(usedPhotoUIDs =>
    DB.run({
      sql: 'SELECT * FROM photos WHERE user = @userUID ORDER BY createdAt DESC',
      params: { userUID },
      json: true
    })
      .then(all)
      .then(rows =>
        rows.map(photo => ({
          ...photo,
          used: usedPhotoUIDs.includes(photo.id)
        }))
      )
  )

module.exports = {
  create,
  remove,
  findByUser
}

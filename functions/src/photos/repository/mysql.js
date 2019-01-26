const uuid = require('uuid/v4')
const DB = require('../../utils/mysql')

const create = async ({ userUID, photo }) => {
  const now = new Date()
  const doc = {
    id: uuid(),
    user: userUID,
    ...photo,
    createdAt: now,
    updatedAt: now
  }
  await DB.insert('photos', doc)
  return doc
}

const remove = photoUID => DB.delete('photos', { id: photoUID })

const findUserUsedPhotoUIDs = userUID =>
  DB.query('SELECT photo1, photo2 FROM battles WHERE user = ?', [userUID])
    .then(rows =>
      rows
        .reduce((acc, { photo1, photo2 }) => [...acc, photo1, photo2], [])
        .filter(global.unique)
    )
    .then(
      photoUIDs =>
        photoUIDs.length
          ? DB.query('SELECT id FROM photos WHERE id IN (?)', [photoUIDs])
          : []
    )
    .then(rows => rows.map(global.pickAttr('id')))

const findByUser = userUID =>
  findUserUsedPhotoUIDs(userUID).then(usedPhotoUIDs =>
    DB.query('SELECT * FROM photos WHERE user = ? ORDER BY createdAt DESC', [
      userUID
    ]).then(rows =>
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

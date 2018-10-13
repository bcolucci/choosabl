const { photosRef } = require('../utils/db')

const fields = ['photo1', 'photo2']

module.exports = async battle => {
  ;(await Promise.all(
    fields.map(field =>
      photosRef
        .where('id', '==', battle[field])
        .limit(1)
        .get()
    )
  ))
    .map(rows => rows.docs.shift())
    .forEach((snap, idx) => {
      Object.assign(battle, {
        [`photo${idx + 1}`]: snap.exists
          ? snap.data()
          : {
            path: 'image-not-found.gif',
            type: 'image/gif'
          }
      })
    })
}

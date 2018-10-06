const { photosRef } = require('../utils/db')

module.exports = async battle => {
  const [photo1, photo2] = await Promise.all(
    ['photo1', 'photo2'].map(field =>
      photosRef
        .where('id', '==', battle[field])
        .limit(1)
        .get()
        .then(snap => snap.docs[0].data())
    )
  )
  Object.assign(battle, { photo1, photo2 })
}

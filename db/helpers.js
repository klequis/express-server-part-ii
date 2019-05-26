import { ObjectID } from  'mongodb'
import { omit } from 'ramda'

// export const removeIdProp = (obj) => {
//   return omit(['_id'], obj)
// }

const checkForHexString = new RegExp('^[0-9a-fA-F]{24}$')

export const isValidHexIdString = id => {
  let _id = ''
  try {
    if (!id) {
      return false
    } else {
      typeof id !== 'string' ? (_id = id.toString()) : (_id = id)
    }
    return checkForHexString.test(_id)
  } catch (e) {
    red(e)
    return false
  }
}

// export const objectIdFromHexString = (hexString) => {
//   try {
//     new ObjectId(_idToDelete)
//   }
//   catch (e) {
//     red(e)
//     throw e
//   }
// }
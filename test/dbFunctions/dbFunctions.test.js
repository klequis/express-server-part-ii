import { expect } from 'chai'
import { fourTodos } from './fixture'
import {
  close,
  dropCollection,
  find,
  findById,
  findOneAndDelete,
  insertOne,
  insertMany,
  findOneAndUpdate
} from '../../db'

after( async () => {
  await close()
})

describe('dbFunctions', () => {
  describe('test dropCollection', function() {
    it('dropCollection: should return true', async function() {
      const drop = await dropCollection('todos')
      expect(drop.data).to.be.true
    })
  })
  describe('test insertMany', function() {
    it('insertMany: should insert 4 todos', async function() {
      const i = await insertMany('todos', fourTodos)
      expect(i.data.length).to.equal(4)
    })
  })
  describe('test find', function() {
    it('find: should return 4 todos', async function() {
      const f = await find('todos')
      expect(f.data.length).to.equal(4)
    })
  })
    
  describe('test findById', function() {
    let idToFind = undefined
    before(async function() {
      await dropCollection('todos')
      const i = await insertMany('todos', fourTodos)
      idToFind = i.data[0]._id.toString()
    })
    it('findById: should return 1 todo with id of second todo', async function() {
      const f = await findById('todos', idToFind)
      expect(f.data.length).to.equal(1)
      const idFound = f.data[0]._id.toString()
      expect(idFound).to.equal(idToFind)
    })
  })

  describe('test findOneAndDelete', function() {
    let idToDelete = undefined
    before(async function() {
      await dropCollection('todos')
      const i = await insertMany('todos', fourTodos)
      idToDelete = i.data[1]._id.toString()
      
    })
    it('findOneAndDelete: should delete 1 of 4 todos', async function() {
      const d = await findOneAndDelete('todos', idToDelete)
      const idDeleted = d.data._id.toString()
      expect(idDeleted).to.equal(idToDelete)
      
    })
  })

  describe('test findOneAndUpdate', function() {
    const newData = { title: 'changed title', completed: true }
    let idToUpdate = undefined
    before(async function() {
      await dropCollection('todos')
      const i = await insertMany('todos', fourTodos)
      idToUpdate = i.data[1]._id.toString()
    })
    it('findOneAndUpdate: should return updated document', async function() {
      const u = await findOneAndUpdate('todos', idToUpdate, newData)
      expect(u.data._id.toString()).to.equal(idToUpdate)
      expect(u.data.title).to.equal(newData.title)
      expect(u.data.completed).to.equal(newData.completed)
    })
  })

  describe('test insertOne', function() {
    // insertOne will only be used for new todos.
    // for new todos, competed is always false and set by the server
    const newData = { title: 'todo added' }
    it('insertOne: should insert new document', async function() {
      const i = await insertOne('todos', newData )
      expect(i.data._id).to.be.not.null
      expect(i.data.title).to.equal('todo added')
    })
  })

})

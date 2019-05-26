import { expect } from "chai";
import request from 'supertest'
import { ObjectIdToHexString } from 'db'
import { fourTodos, oneTodo } from "./fixture"
import app from 'server'
import { ObjectId } from 'mongodb'
import {
  close,
  dropCollection,
  find,
  // findById,
  // findOneAndDelete,
  // insertOne,
  insertMany,
  // findOneAndUpdate
} from 'db'

const collectionName = 'todos'

after(async () => {
  await close()
})


describe('todo-route', function() {

  describe('test GET /api/todo', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    it('should return 4 todos', async function() {
      const get = await request(app)
        .get('/api/todo')
        .set('Accept', 'application/json')
        .send()
        .expect('Content-Type', /json/)
        .expect(200)
      const data = get.body.data
      expect(data.length).to.equal(4)
      
    })
  })

  describe('test GET /api/todo/:id', function() {
    let _idToGet = ''
    before(async function() {
      await dropCollection(collectionName)
      const insert = await insertMany(collectionName, fourTodos)
      console.log('insert', )
      _idToGet = insert.data[1]._id.toString()
      
    })
    it('should get todo with specified _id', async function() {

    })
  })

  describe('test POST /api/todo', function() {
    before(async function () {
      await dropCollection(collectionName)
    })
    it('should post 1 todo', async function() {
      const post = await request(app)
        .post('/api/todo')
        .set('Accept', 'application/json')
        .send(oneTodo)
        .expect('Content-Type', /json/)
        .expect(200)
      const data = post.body.data
      expect(data.title).to.equal(oneTodo.title)
      expect(data.completed).to.equal(false)

      // Confirm using find(). Remember, find() will return an array
      const findRes = await find(collectionName, {})
      const findData = findRes.data
      expect(findData[0].title).to.equal(oneTodo.title)
      expect(findData[0].completed).to.equal(false)
      
    })
  })

  describe('test DELETE /api/todo/:id', function() {
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
    })
    let _idToDelete = ''
    it('check there are 4 records', async function() {
      const findRes = await find(collectionName, {})
      expect(findRes.data.length).to.equal(4)
      _idToDelete = findRes.data[1]._id
      const oid = new ObjectId(_idToDelete).toHexString()
      console.log('_idToDelete', _idToDelete)
      console.log('oid', oid)
      console.log('_idToDelete.toString()', _idToDelete.toString());
      console.log('mine', ObjectIdToHexString(_idToDelete))
      
      
      

      
    })
    it('should delete one record', async function() {
      const post = await request(app)
        .delete(`/api/todo/${_idToDelete}`)
        .set('Accept', 'application/json')
        .send()
        .expect(200)
      const deleteData = post.body.data
      console.log('deleteData', deleteData)
      expect(deleteData._id).to.equal(_idToDelete)
    })
  })
})

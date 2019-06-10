import { expect } from "chai";
import request from 'supertest'
import { fourTodos, oneTodo } from "./fixture"
import app from 'server'
import {
  close,
  dropCollection,
  find,
  // findById,
  // findOneAndDelete,
  // insertOne,
  insertMany,
  findOneAndUpdate
} from 'db'

import { yellow } from 'logger'

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
    let _idToDelete = ''
    before(async function() {
      await dropCollection(collectionName)
      await insertMany(collectionName, fourTodos)
      const findRes = await find(collectionName, {})
      expect(findRes.data.length).to.equal(4)
      _idToDelete = findRes.data[1]._id
    })
    it('should delete one record', async function() {
      const delRes = await request(app)
        .delete(`/api/todo/${_idToDelete}`)
        .set('Accept', 'application/json')
        .send()
        .expect(200)
      const delData = delRes.body.data
      expect(delData._id).to.equal(_idToDelete.toHexString())
    })
  })

  describe('test PATCH /api/todo/:id', function() {
    const newData = { title: 'changed title', completed: true }
    let idToUpdate
    before(async function() {
      await dropCollection(collectionName)
      const inserted = await insertMany(collectionName, fourTodos)
      idToUpdate = inserted.data[1]._id.toString()
    })
    it('should return document document with updated title', async function() {
      const updateRes = await request(app)
        .patch(`/api/todo/${idToUpdate}`)
        .set('Accept', 'application/json')
        .send(newData)
      yellow('updateRes')
      const data = updateRes.body.data
      yellow('data', data)
      expect(data.title).to.equal(newData.title)
      expect(data.completed).to.equal(true)
      
    })
  })
})
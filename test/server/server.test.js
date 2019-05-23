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
      console.log('post', data)
      expect(data.title).to.equal(oneTodo.title)
      expect(data.completed).to.equal(false)

      // Confirm using find(). Remember, find() will return an array
      const findRes = await find(collectionName, {})
      console.log('findRes', findRes)
      const findData = findRes.data
      console.log('findData', findData)
      expect(findData[0].title).to.equal(oneTodo.title)
      expect(findData[0].completed).to.equal(false)
      
    })
  })
})

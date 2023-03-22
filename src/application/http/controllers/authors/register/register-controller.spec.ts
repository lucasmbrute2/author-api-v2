import request from 'supertest'
import { app } from '@/application/app'
import { describe, expect, it } from 'vitest'

describe('Register (e2e)', () => {
  it('should be able to register', async () => {
    const response = await request(app).post('/author').send({
      name: 'John Doe',
      username: 'johndoe@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        accessToken: expect.any(String),
      }),
    )
  })
})

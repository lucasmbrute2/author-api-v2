import request from 'supertest'
import { app } from '@/application/app'
import { describe, expect, it } from 'vitest'

describe('Authenticate (e2e)', () => {
  it('should be able to authenticate', async () => {
    await request(app).post('/author').send({
      name: 'John Doe',
      username: 'johndoe@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    const response = await request(app).patch('/author/session').send({
      username: 'johndoe@gmail.com',
      password: 'password123',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      accessToken: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})

import request from 'supertest'
import { app } from '@/application/app'
import { describe, expect, it } from 'vitest'

describe('Refresh token (e2e)', () => {
  it('should be able to refresh token from author', async () => {
    const registerResponse = await request(app).post('/author').send({
      name: 'John Doe',
      username: 'johndoe@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    const refreshToken = registerResponse.get('Set-Cookie')

    const response = await request(app)
      .patch('/author/token/refresh')
      .set('Cookie', refreshToken)

    const cookies = response.get('Set-Cookie')

    expect(response.statusCode).toEqual(200)
    expect(cookies).toEqual([expect.stringContaining('refreshToken=')])
  })
})

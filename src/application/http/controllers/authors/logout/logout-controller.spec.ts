import request from 'supertest'
import { app } from '@/application/app'
import { describe, expect, it } from 'vitest'

describe('Logout (e2e)', () => {
  it('should be able to logout author', async () => {
    const registerResponse = await request(app).post('/author').send({
      name: 'John Doe',
      username: 'johndoe@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    const { accessToken } = registerResponse.body

    const response = await request(app)
      .get('/author/logout')
      .set({
        Authorization: `Bearer ${accessToken}`,
      })

    const cookies = response.get('Set-Cookie')

    expect(response.statusCode).toEqual(200)
    expect(cookies).toEqual([expect.not.stringContaining('Max-Age')])
  })
})

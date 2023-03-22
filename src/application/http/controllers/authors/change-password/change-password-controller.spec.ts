import request from 'supertest'
import { app } from '@/application/app'
import { describe, expect, it } from 'vitest'

describe('Change password (e2e)', () => {
  it('should be able to change password', async () => {
    const registerResponse = await request(app).post('/author').send({
      name: 'John Doe',
      username: 'johndoe@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    })

    const { accessToken } = registerResponse.body

    const response = await request(app)
      .patch('/author/password')
      .send({
        newPassword: 'new-password',
        oldPassword: 'password123',
      })
      .set({
        Authorization: `Bearer ${accessToken}`,
      })

    expect(response.statusCode).toEqual(204)
  })
})

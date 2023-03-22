import { Environment } from 'vitest'

export default <Environment>{
  name: 'e2e-databases', // nome no enviroment
  async setup() {
    console.log('setup')

    return {
      async teardown() {
        console.log('teardown')
      },
    }
  },
}

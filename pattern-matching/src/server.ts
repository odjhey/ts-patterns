import { match } from 'ts-pattern'
import { TOkayable, imbentoFetch } from './fixtures'

console.log('hello pattern-matching')

const main = async () => {
  const getSomething = async (): Promise<TOkayable<string, Error>> => {
    try {
      const result = await imbentoFetch()
      return { ok: true, data: result }
    } catch (error) {
      return { ok: false, error }
    }
  }

  const result = await getSomething()

  // if (result.ok) {
  //   console.log(result.data)
  // } else {
  //   console.error(result.error)
  // }

  // Bro inspect the type of `another` below
  const another = match(result)
    .with({ ok: true }, ({ data }) => {
      console.log(data)
      if (data === 'Hello, world!') {
        return { type: 'success_greeting' } as const
      }
      return { type: 'success_any' } as const
    })
    .with({ ok: false }, ({ error }) => {
      console.error(error)
      return { type: 'failure' } as const
    })
    .exhaustive()
}

main()

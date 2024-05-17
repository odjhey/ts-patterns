export type TOkayable<T, E extends Error> =
  | { ok: true; data: T }
  | { ok: false; error: E }

export const imbentoFetch = async () => {
  // fail 20% of the time
  if (Math.random() < 0.2) {
    throw new Error('Failed to fetch')
  }

  return new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve('Hello, world!')
    }, 200)
  })
}

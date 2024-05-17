type AnyFunction = (...args: any[]) => any

class Procedure<TDeps extends Record<string, AnyFunction>, TInput, TOutput> {
  private dependencies!: TDeps
  private execFunction!: (context: { input: TInput; events: TDeps }) => TOutput

  static deps<TDeps extends Record<string, AnyFunction>>() {
    return new Procedure<TDeps, any, any>()
  }

  deps(dependencies: TDeps): this {
    this.dependencies = dependencies
    return this
  }

  exec(
    execFunction: (context: { input: any; events: TDeps }) => TOutput
  ): this {
    this.execFunction = execFunction
    return this
  }

  run(input: any): TOutput {
    if (!this.dependencies || !this.execFunction) {
      throw new Error('Dependencies or execution function not defined.')
    }
    return this.execFunction({ input, events: this.dependencies })
  }
}

// Example usage
type Save = { save: (input: { id: string }) => { id: string } }

const createOrder = Procedure.deps<Save>().exec(({ input, events }) => {
  const order = events.save(input)
  return order
})

const PersistentOrder = {
  save: <T>(order: T) => {
    console.log('save order', order)
    return order
  },
}

// Usage
const main = async () => {
  const order = createOrder
    .deps({
      save: ({ id }) => {
        return PersistentOrder.save({ id })
      },
    })
    .run({ id: '1' })

  console.log('order', order) // Outputs: order { id: '1' }
}

main()

export {}

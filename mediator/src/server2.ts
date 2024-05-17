type AnyFunction = (...args: any[]) => any

interface ProcedureDeps<T> {
  deps: (events: T) => {
    exec: () => any
  }
}

class Procedure<TDeps, TInput, TOutput> {
  private dependencies!: TDeps
  private execFunction!: (context: { input: TInput; events: TDeps }) => TOutput
  private input!: TInput

  static deps<TDeps>() {
    return new Procedure<TDeps, any, any>()
  }

  deps(dependencies: TDeps): this {
    this.dependencies = dependencies
    return this
  }

  fn(
    execFunction: (context: { input: TInput; events: TDeps }) => TOutput
  ): this {
    this.execFunction = execFunction
    return this
  }

  run(input: TInput): TOutput {
    if (!this.dependencies || !this.execFunction) {
      throw new Error('Dependencies or execution function not defined.')
    }
    this.input = input
    return this.execFunction({ input: this.input, events: this.dependencies })
  }
}

// Example usage
type Save = { fn: (input: { id: string }) => { id: string } }

const createOrder = Procedure.deps<{ save: Save }>().fn(({ input, events }) => {
  const order = events.save.fn(input)
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
      save: {
        fn: ({ id }) => {
          return PersistentOrder.save({ id })
        },
      },
    })
    .run({ id: '1' })

  console.log('order', order) // Outputs: order { id: '1' }
}

main()

export {}

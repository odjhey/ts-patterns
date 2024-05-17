console.log('hello mediator')

const PersistentOrder = {
  save: <T>(order: T) => {
    console.log('save order', order)
    return order
  },
}

// const business logic

// since we cant do below for exhaustive check etc, we use object
// type save = { event: 'save'; fn: (input: { id: string }) => { id: string } }

const createOrder = (input: { id: string }) => {
  // define deps
  type save = { fn: (input: { id: string }) => { id: string } }

  return {
    deps: (events: { save: save }) => {
      return {
        exec: () => {
          const order = events.save.fn(input)
          return order
        },
      }
    },
  }
}

const main = async () => {
  const order = createOrder({ id: '1' })
    .deps({
      save: {
        fn: ({ id }) => {
          return PersistentOrder.save({ id })
        },
      },
    })
    .exec()

  console.log('order', order)
}

main()

export {}

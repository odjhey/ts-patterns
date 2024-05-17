import { createOrder } from './core/create-order.domain'

const PersistentOrder = {
  save: <T>(order: T) => {
    console.log('save order asdlfkj', order)
    return order
  },
}

const main = async () => {
  const order = createOrder
    .deps({
      save: ({ id }) => {
        return PersistentOrder.save({ id })
      },
      newShipment: ({ orderId }) => {
        return { orderId, shipmentId: '123' }
      },
    })
    .run({ id: '2' })

  console.log('order', order) // Outputs: order { id: '1' }
}

main()

export {}

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
        // throw new Error('shipment error')
      },
    })
    .run({ id: '2' })

  if (order.ok === false) {
    console.error('error', order.error.message)
  } else {
    console.log(order.data)
  }
}

main()

export {}

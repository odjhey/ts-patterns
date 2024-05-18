import { Procedure } from '../lib'

export type Deps = {
  save: (input: { id: string }) => Promise<{ id: string }>
  newShipment: (input: { orderId: string }) => { orderId: string; shipmentId }
}
export const createOrder = Procedure.deps<Deps>()
  .input((input: { id: string }) => ({ id: input.id }))
  .fn(async ({ input, deps }) => {
    const order = await deps.save(input)
    const shipment = deps.newShipment({ orderId: order.id })
    return { order, shipment }
  })

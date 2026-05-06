import { string, z } from 'zod';

export const OrderSchema = z.object({
  serviceBathroom: string({ required_error: 'Bathroom service is required' }),
  servicelivingRoom: string({ required_error: 'Living room service is required' }),
  serviceKitchen: string({ required_error: 'Kitchen service is required' }),
  serviceSwimmingPool: string({ required_error: 'Swimming pool service is required' }),
  serviceBalcony: string({ required_error: 'Balcony service is required' }),
  serviceLampLight: string({ required_error: 'Lamp or light service is required' }),
  serviceCabinet: string({ required_error: 'Cabinet service is required' }),
  serviceFridge: string({ required_error: 'Fridge service is required' }),
  serviceCurtain: string({ required_error: 'Curtain service is required' }),
  bathroom_qty: string({ required_error: 'required' }),
  living_room_qty: string({ required_error: 'required' }),
  kitchen_qty: string({ required_error: 'required' }),
  swimming_pool_qty: string({ required_error: 'required' }),
  balcony_qty: string({ required_error: 'required' }),
  lamp_light_qty: string({ required_error: 'required' }),
  cabinet_qty: string({ required_error: 'required' }),
  fridge_qty: string({ required_error: 'required' }),
  curtain_qty: string({ required_error: 'required' })
});

export type OrderSchemaProps = z.infer<typeof OrderSchema>;

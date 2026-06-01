import { useParams } from 'react-router-dom'

export default function CouponForm() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {id ? 'Edit Coupon' : 'New Coupon'}
      </h1>
      <p className="text-gray-500">Coupon form coming soon.</p>
    </div>
  )
}

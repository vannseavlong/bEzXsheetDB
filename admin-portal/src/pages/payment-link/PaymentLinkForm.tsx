import { useParams } from 'react-router-dom'

export default function PaymentLinkForm() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {id ? 'Edit Payment Link' : 'New Payment Link'}
      </h1>
      <p className="text-gray-500">Payment link form coming soon.</p>
    </div>
  )
}

import { useParams } from 'react-router-dom'

export default function PushNotificationForm() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {id ? 'Edit Push Notification' : 'New Push Notification'}
      </h1>
      <p className="text-gray-500">Push notification form coming soon.</p>
    </div>
  )
}

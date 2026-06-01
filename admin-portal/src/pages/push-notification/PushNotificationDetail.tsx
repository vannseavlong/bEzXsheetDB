import { useParams } from 'react-router-dom'

export default function PushNotificationDetail() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Push Notification Detail</h1>
      <p className="text-gray-500">Push notification {id} detail coming soon.</p>
    </div>
  )
}

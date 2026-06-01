import { useParams } from 'react-router-dom'

export default function CleanerForm() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {id ? 'Edit Cleaner' : 'New Cleaner'}
      </h1>
      <p className="text-gray-500">Cleaner form coming soon.</p>
    </div>
  )
}

import { useParams } from 'react-router-dom'

export default function Tickets() {
  const { id } = useParams()
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {id ? `Ticket #${id}` : 'Tickets'}
      </h1>
      <p className="text-gray-500">{id ? 'Ticket detail coming soon.' : 'Ticket list coming soon.'}</p>
    </div>
  )
}

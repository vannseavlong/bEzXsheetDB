import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotAuthorised() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center p-8">
      <p className="text-5xl font-bold text-muted-foreground">403</p>
      <h1 className="text-xl font-semibold">Not Authorised</h1>
      <p className="text-sm text-muted-foreground max-w-xs">
        You don't have permission to access this page. Contact your administrator if you think this is a mistake.
      </p>
      <Button variant="outline" onClick={() => navigate('/')}>Go to Dashboard</Button>
    </div>
  )
}

import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function CalendarHeaderLeft() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-row items-center h-22 w-full">
      <div className="flex flex-row items-center px-2 w-full gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="size-6!" />
        </Button>
        <p className="text-xl font-bold text-primary">bEasy Calendar</p>
      </div>
    </div>
  );
}

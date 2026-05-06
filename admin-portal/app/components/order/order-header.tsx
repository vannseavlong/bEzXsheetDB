import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { Button } from '../ui/button';

export default function OrderHeader() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-row items-center bg-white">
      <div className="flex flex-row items-center p-6 w-[400px]">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="!size-6" />
        </Button>
        <p className="text-xl font-bold">Order Management</p>
      </div>
    </div>
  );
}

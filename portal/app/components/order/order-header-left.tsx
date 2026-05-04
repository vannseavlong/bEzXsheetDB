import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { CardTitle } from '../ui/card';

export default function OrderHeaderLeft() {
  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-row items-center h-22">
      <div className="flex flex-row items-center px-6 w-100 gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="size-6!" />
        </Button>
        {/* <img src={beasyIcon} className="w-12 h-12" /> */}
        <CardTitle className="text-lg font-bold">Order Management</CardTitle>
      </div>
    </div>
  );
}

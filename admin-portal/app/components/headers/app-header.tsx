import { useNavigate } from 'react-router';
import HeaderRight from '../common/header-right';
import useCanGoBack from '@/hooks/use-can-go-back';
import { ChevronLeft, MenuIcon } from 'lucide-react';
import { Button } from '../ui/button';
import HeaderTitle from './header-title';
import { useSidebar } from '../ui/sidebar';

export default function AppHeader() {
  const { canGoBack, hiddenHeader } = useCanGoBack();
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  if (hiddenHeader) return null;

  return (
    <div className="h-22 p-6 pl-4 flex w-full items-center flex-row">
      <div className="flex-row items-center gap-4 flex md:hidden">
        <Button variant="ghost" size="icon" type="button" onClick={toggleSidebar}>
          <MenuIcon className="size-6!" />
        </Button>
      </div>
      <div className="flex flex-1 flex-row gap-4 items-center">
        {canGoBack && (
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
          >
            <ChevronLeft className="size-6!" />
          </Button>
        )}
        <HeaderTitle />
      </div>
      <HeaderRight />
    </div>
  );
}

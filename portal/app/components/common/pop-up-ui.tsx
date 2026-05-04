// pop-up-ui.tsx
import React from 'react';
import { popupOptions } from '@/constants/data-dummy';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type PopUpUIProps = {
  popupId: string;
  open: boolean;
  onClose: () => void;
  onConfirm?: (inputValue?: string) => void;
};

const PopUpUI: React.FC<PopUpUIProps> = ({ popupId, open, onClose, onConfirm }) => {
  const config: popupOptionProps | undefined = popupOptions.find((opt) => opt.id === popupId);

  const [inputValue, setInputValue] = React.useState('');

  if (!config) return null;

  const isInput = config.inputPlaceholder;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(isInput ? inputValue : undefined);
    }
    setInputValue('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[536px] rounded-[4px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{isInput ? null : config.description}</DialogDescription>
        </DialogHeader>

        {isInput && (
          <div className="flex justify-start items-start left-0 top-0">
            <Textarea
              placeholder={config.description}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-25 w-[488px] p-[12px] rounded-[6px] border-[1px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 rounded-[4px] border-outline/soft"
          >
            {config.cancelText}
          </Button>
          <Button
            className="px-4 py-2 rounded-[4px]"
            variant={config.variant}
            onClick={handleConfirm}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PopUpUI;

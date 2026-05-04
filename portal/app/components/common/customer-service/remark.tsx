import { Input } from '@/components/ui/input';
import { useUpdateLastContactMutation } from '@/hooks/mutations/use-update-last-contact-mutation';
import { useEffect, useState } from 'react';

export default function Remark({
  remark,
  lastContactDate,
  id
}: {
  remark?: string;
  lastContactDate?: string;
  id: string;
}) {
  const [description, setDescription] = useState<string>('');
  // const handlerRef = useRef<NodeJS.Timeout>(null);
  const { mutate, isPending } = useUpdateLastContactMutation();

  useEffect(() => {
    setDescription(remark || '');
  }, [remark]);

  const handleApi = () => {
    mutate({
      userId: id,
      lastContactDate: lastContactDate,
      remark: description
    });
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    // Check if the key pressed is the 'Enter' key
    if (event.key === 'Enter') {
      // Prevent the default form submission behavior (if the input is inside a form)
      event.preventDefault();

      // Execute your desired action here
      // Example: Call the API immediately with the current 'description' state
      console.log('API call with description:', description);
      handleApi();

      // If you were using the timeout logic, you'd call it here
      // handlerRef.current = setTimeout(async () => { ... });
    }
  };

  return (
    <div className="w-[200px]">
      <Input
        value={description}
        disabled={!lastContactDate || isPending}
        onBlur={handleApi}
        onKeyDown={handleEnterPress}
        onChange={(val) => {
          setDescription(val.target.value);
        }}
      />
    </div>
  );
}

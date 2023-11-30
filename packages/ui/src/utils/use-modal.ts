import { useState } from "react";

export default function useModal<T>(): {
  value: T | null;
  open: boolean;
  onOpen: (value: T) => void;
  onClose: () => void;
} {
  const [value, setValue] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const onOpen = (value: T) => {
    setValue(value);
    setOpen(true);
  };
  const onClose = () => setOpen(false);
  return {
    value,
    open: value !== null && open,
    onOpen,
    onClose,
  };
}

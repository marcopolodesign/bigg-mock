import { Drawer } from "vaul";
import type { ReactNode } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function BottomSheet({ open, onClose, children, title = "Panel" }: BottomSheetProps) {
  return (
    <Drawer.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[70]" />
        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-[70] flex flex-col rounded-t-[28px] bg-[#ededed] outline-none max-h-[92vh]"
        >
          <Drawer.Title className="sr-only">{title}</Drawer.Title>
          {/* Drag handle */}
          <div className="flex justify-center pt-[14px] pb-[4px] shrink-0">
            <div className="w-[40px] h-[4px] rounded-full bg-[#c4c4c4]" />
          </div>
          <div className="overflow-y-auto" data-vaul-no-drag>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

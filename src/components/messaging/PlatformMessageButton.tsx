import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import PlatformMessageDialog, { RecipientKind } from "./PlatformMessageDialog";

interface Props {
  recipientKind: RecipientKind;
  recipientSlug: string;
  recipientName: string;
  recipientUserId?: string | null;
  defaultSubject?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  fullWidth?: boolean;
}

const PlatformMessageButton = ({
  recipientKind,
  recipientSlug,
  recipientName,
  recipientUserId,
  defaultSubject,
  variant = "default",
  size = "default",
  className = "",
  label = "Mesaj Gönder",
  fullWidth = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={`gap-2 ${fullWidth ? "w-full" : ""} ${className}`}
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="h-4 w-4" /> {label}
      </Button>
      <PlatformMessageDialog
        open={open}
        onOpenChange={setOpen}
        recipientKind={recipientKind}
        recipientSlug={recipientSlug}
        recipientName={recipientName}
        recipientUserId={recipientUserId}
        defaultSubject={defaultSubject}
      />
    </>
  );
};

export default PlatformMessageButton;

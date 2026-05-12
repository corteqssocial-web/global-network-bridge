import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Lock, Mail, UserPlus, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useFollow } from "@/hooks/useFollow";
import { supabase } from "@/integrations/supabase/client";

export type RecipientKind =
  | "consultant"
  | "volunteer"
  | "business"
  | "association"
  | "blogger"
  | "vlogger"
  | "ambassador"
  | "individual";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientKind: RecipientKind;
  recipientSlug: string;
  recipientName: string;
  /** Optional already-known auth user id of the recipient (for real users). */
  recipientUserId?: string | null;
  defaultSubject?: string;
}

const PlatformMessageDialog = ({
  open,
  onOpenChange,
  recipientKind,
  recipientSlug,
  recipientName,
  recipientUserId,
  defaultSubject,
}: Props) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(defaultSubject ?? "");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const goToAuth = () => {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    onOpenChange(false);
    navigate(`/auth?redirect=${redirect}`);
  };

  const send = async () => {
    if (!user) return;
    const text = body.trim();
    if (!text) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: user.id,
      sender_name: profile?.full_name ?? null,
      recipient_user_id: recipientUserId ?? null,
      recipient_kind: recipientKind,
      recipient_slug: recipientSlug,
      recipient_name: recipientName,
      subject: subject.trim() || null,
      body: text,
      context_url: window.location.pathname,
    });
    setSending(false);
    if (error) {
      toast({ title: "Mesaj gönderilemedi", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Mesaj gönderildi",
      description: `${recipientName} en kısa sürede sana dönecek. Mesajların panelindeki Mesaj Kutusu'nda.`,
    });
    setBody("");
    setSubject("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {!user ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> Mesaj göndermek için kayıt ol
              </DialogTitle>
              <DialogDescription>
                Platform içi gizlilik için iletişim doğrudan numara/mail üzerinden yapılmaz. Ücretsiz hesabını oluştur — kayıt biter bitmez {recipientName} ile mesaj penceresinden devam edersin.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Vazgeç</Button>
              <Button onClick={goToAuth} className="gap-2">
                <Mail className="h-4 w-4" /> Kayıt Ol / Giriş Yap
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> {recipientName}'e mesaj
              </DialogTitle>
              <DialogDescription>
                Mesajın platform üzerinden iletilir. Cevap geldiğinde panelindeki Mesaj Kutusu'nda bildirim alırsın.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                placeholder="Konu (opsiyonel)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
              />
              <Textarea
                placeholder="Mesajını yaz..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={2000}
              />
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button onClick={send} disabled={!body.trim() || sending} className="gap-2">
                <Send className="h-4 w-4" /> {sending ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlatformMessageDialog;

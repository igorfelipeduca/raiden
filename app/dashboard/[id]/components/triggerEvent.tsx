import EventToast from "@/components/EventTrigger";
import { Toast, useToast } from "@/app/contexts/toastContext";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { createClient } from "@supabase/supabase-js";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_SUPABASE_URL as string,
  process.env.NEXT_SUPABASE_ANON_KEY as string
);

interface TriggerEventProps {
  ownerId: string;
  categoryId: string;
  boardToasts: Toast[];
  setBoardToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

export default function TriggerEvent({
  ownerId,
  categoryId,
  boardToasts,
  setBoardToasts,
}: TriggerEventProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { toasts, addToast, cleanToasts } = useToast();
  const [name, setName] = useState<string>("Hello, world!");
  const [emoji, setEmoji] = useState<string>("👋");
  const [type, setType] = useState<string>("default");
  const [triggerLoading, setTriggerLoading] = useState<boolean>(false);

  const testToast = () => {
    addToast({
      text: name,
      emoji,
      type,
    });
  };

  const createEvent = async () => {
    setTriggerLoading(true);

    const { data, error } = await supabase
      .from("toasts")
      .upsert({
        text: name,
        emoji,
        type,
        owner: ownerId,
        category_id: categoryId,
      })
      .select("*");

    if (error) {
      console.log({ error });
    }

    if (data) {
      console.log({ data });

      if (data.length) {
        toast.success("🎉 New event added to the board");
      }

      setBoardToasts([...boardToasts, data[0]]);
      setTriggerLoading(false);
    }
  };

  const onClose = () => {
    cleanToasts();
  };

  return (
    <>
      <Button
        className="w-full bg-zinc-50 border border-dashed border-zinc-200 flex items-center gap-x-2 text-zinc-400 transiton-all ease-linear duration-150 hover:text-zinc-600"
        onPress={onOpen}
      >
        <Plus className="h-5 w-5" /> Trigger event
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="opaque"
        className="rounded-lg"
        onClose={onClose}
      >
        <ModalContent className="p-2">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Trigger a new event
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  variant="bordered"
                  className="rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Select
                  label={"Type"}
                  className="rounded-lg"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <SelectItem key={"default"} value={"default"}>
                    Default
                  </SelectItem>
                  <SelectItem key={"success"} value={"success"}>
                    Success
                  </SelectItem>
                  <SelectItem key={"error"} value={"error"}>
                    Error
                  </SelectItem>
                  <SelectItem key={"warning"} value={"warning"}>
                    Warning
                  </SelectItem>
                </Select>

                <Input
                  autoFocus
                  label="Emoji"
                  variant="bordered"
                  className="rounded-lg"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                />

                {toasts.length ? (
                  <div className="py-4 space-y-2">
                    {toasts.map((toast, index) => (
                      <EventToast
                        toast={toast}
                        key={index}
                        setToasts={setBoardToasts}
                      />
                    ))}
                  </div>
                ) : (
                  <></>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  className="bg-zinc-100 text-black rounded-lg"
                  onPress={testToast}
                >
                  Test event
                </Button>

                <Button
                  color="primary"
                  className="rounded-lg bg-black text-white"
                  onPress={createEvent}
                >
                  {triggerLoading ? "Loading..." : "Trigger"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar } from "@nextui-org/react";
import { Cog, User, UserCircle } from "lucide-react";

export default function SettingsModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex gap-x-2 items-center text-sm text-zinc-500 transition-all duration-150 ease-linear hover:text-zinc-700">
          <Cog className="h-4 w-4" />
          Settings
        </div>
      </DialogTrigger>
      <DialogContent className="p-0">
        <div className="h-full flex gap-x-2">
          <div className="h-full bg-zinc-100 p-4 space-y-4">
            <div className="text-zinc-500 text-xs">Account</div>

            <div className="flex gap-x-2 items-center">
              <Avatar
                radius="full"
                src={
                  "https://images.unsplash.com/photo-1697197850355-c70e8ea18394?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                className="cursor-pointer h-7 w-7"
              />

              <div className="space-y-1">
                <h3 className="text-zinc-600 text-xs">Raiden</h3>
                <h3 className="text-zinc-500 text-xs">raiden.app@proton.me</h3>
              </div>
            </div>

            <div className="flex gap-x-2 text-zinc-600 items-center mt-4 cursor-pointer">
              <UserCircle className="h-4 w-4" />

              <h3 className="text-xs">Account</h3>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

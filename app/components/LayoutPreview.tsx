import { CircleDot } from "lucide-react";
import EventToast from "./EventTrigger";
import { useEffect, useRef, useState } from "react";
import { Toast, useToast } from "../contexts/toastContext";
import { Button } from "@nextui-org/react";
import { toast } from "sonner";

export default function LayoutPreview() {
  const [replayVisible, setReplayVisible] = useState<boolean>(false);
  const [replay, setReplay] = useState<boolean>(false);

  let demonstrationDone = false;

  const toastList: Toast[] = [
    {
      text: "Visited the project: Biome",
    },
    {
      text: "Clicked to see more details of Biome",
    },
    {
      text: "Bought Biome!",
      type: "success",
      emoji: "🎉",
    },
  ];

  const secondToastList: Toast[] = [
    {
      text: "Visited the project: Raiden",
    },
    {
      text: "Clicked to see more details of Raiden",
    },
    {
      text: "Left during the checkout page",
      type: "error",
    },
  ];

  const thirdToastList: Toast[] = [
    {
      text: "Visited the project: NextSnap",
    },
    {
      text: "Left the page without clicking on anything",
      type: "error",
    },
  ];

  const { addToast, cleanToasts, toasts } = useToast();
  const [toastAdded, setToastAdded] = useState<boolean>(false);

  const populateToasts = () => {
    toastList.forEach((toast, index) => {
      setTimeout(() => {
        addToast(toast);
        setToastAdded(true);

        setTimeout(() => {
          setToastAdded(false);
        }, 700);
      }, (index + 1) * 1000);
    });

    setTimeout(() => {
      secondToastList.forEach((toast, index) => {
        setTimeout(() => {
          addToast(toast);
          setToastAdded(true);

          setTimeout(() => {
            setToastAdded(false);
          }, 700);
        }, (index + 1) * 1000);
      });
    }, 8000);

    setTimeout(() => {
      thirdToastList.forEach((toast, index) => {
        setTimeout(() => {
          addToast(toast);
          setToastAdded(true);

          setTimeout(() => {
            setToastAdded(false);
          }, 700);
        }, (index + 1) * 1000);
      });
    }, 12000);
  };

  const demonstrationDoneRef = useRef<boolean>(false);

  useEffect(() => {
    populateToasts();
  }, []);

  setTimeout(() => {
    setReplayVisible(true);

    if (!demonstrationDoneRef.current)
      toast("✨ Demonstration done!", {
        action: {
          label: "Sign up",
          onClick: () => (window.location.href = "/signup"),
        },
      });

    demonstrationDoneRef.current = true;
  }, 15000);

  useEffect(() => {
    if (replay) {
      cleanToasts();

      populateToasts();
      setReplayVisible(false);
    }

    setTimeout(() => {
      setReplay(false);
      setReplayVisible(true);
    }, 15000);
  }, [replay]);

  return (
    <div className="w-full mx-auto lg:max-w-3xl border border-zinc-200 rounded-xl p-8 shadow-lg shadow-zinc-100">
      {/* {replayVisible && (
        <div className="flex justify-center pb-4">
          <Button
            className="bg-black text-white rounded-full font-semibold animate-in fade-in"
            onClick={() => setReplay(true)}
          >
            Replay ✨
          </Button>
        </div>
      )} */}

      <div className="flex justify-center">
        <div className="flex gap-x-2 text-zinc-700 items-center">
          <CircleDot
            className={`text-blue-500 transition-all duration-400 ease-in-out ${
              toastAdded ? "scale-105 opacity-30" : ""
            }`}
          />

          <h1 className="text-xl font-semibold">Duca&apos;s events</h1>
        </div>
      </div>

      <div className="w-full flex justify-center mt-8 flex-col gap-y-4 mx-auto max-w-md">
        {toasts
          .filter((toast, index, self) => {
            return self.findIndex((t) => t.text === toast.text) === index;
          })
          .map((item, index) => (
            <EvenstToast toast={item} key={index} />
          ))}
      </div>
    </div>
  );
}

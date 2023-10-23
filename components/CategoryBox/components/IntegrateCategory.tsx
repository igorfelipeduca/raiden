import React from "react";
import {
  Code,
  Textarea,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";

import { Fingerprint, Globe, PanelLeft, ZapIcon } from "lucide-react";
import EventToast from "../../EventTrigger";
import { Toast } from "@/app/contexts/toastContext";
import { Category } from "..";

interface IntegrateCategoryProps {
  owner: string;
  category: Category;
  workspaceId: string;
}

export default function IntegrateCategory({
  owner,
  category,
  workspaceId,
}: IntegrateCategoryProps) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const curlSnippet = `var myHeaders = new Headers();
  myHeaders.append("x-api-key", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imlnb3JkdWNjYUBnbWFpbC5jb20ifQ.vWx-zv6za51IK0IW6yDcgMDMoP22blIdinP7MLGBXOs");
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "text": "Real-time notification!",
    "emoji": "⚡️",
    "owner": "${owner}",
    "category_id": "${category.id}"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/api/webhook/37", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));`;

  const exampleToast: Toast = {
    text: "Real-time notification!",
    emoji: "⚡️",
    owner: owner,
    type: "api",
  };

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <ZapIcon className="h-4 w-4 transition-all duration-150 ease-linear hover:text-green-500 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex items-center gap-x-2 text-sm text-zinc-400">
            <ZapIcon className="h-4 w-4" />

            <h3>Integrate real-time</h3>
          </div>

          <div className="p-1 border border-zinc-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-x-2 text-zinc-400">
              <Globe className={`${iconClasses} text-zinc-500`} />

              <h3 className="text-sm flex items-center gap-x-2">
                Category id{" "}
                <span>
                  {" "}
                  <Code className="text-zinc-500 text-sm">{category.id}</Code>
                </span>
              </h3>
            </div>
          </div>

          <div className="p-1 border border-zinc-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-x-2 text-zinc-400">
              <PanelLeft className={`${iconClasses} text-zinc-500`} />

              <h3 className="text-sm flex items-center gap-x-2">
                Workspace id{" "}
                <span>
                  {" "}
                  <Code className="text-zinc-500 text-sm">{workspaceId}</Code>
                </span>
              </h3>
            </div>
          </div>

          <div className="p-1 border border-zinc-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-x-2 text-zinc-400">
              <Fingerprint className={`${iconClasses} text-zinc-500`} />

              <h3 className="text-sm flex items-center gap-x-2">
                Owner id{" "}
                <span>
                  {" "}
                  <Code className="text-zinc-500 text-sm">
                    {category.owner}
                  </Code>
                </span>
              </h3>
            </div>
          </div>

          <Textarea value={curlSnippet} />

          <div className="mt-2">
            <EventToast toast={exampleToast} isStatic />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

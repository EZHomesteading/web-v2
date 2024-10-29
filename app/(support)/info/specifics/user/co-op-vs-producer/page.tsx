"use client";
import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { XIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type RoleType = {
  name: string;
  privileges: {
    [key: string]: boolean;
  };
};

const roles: Record<string, RoleType> = {
  "co-op": {
    name: "Co-op",
    privileges: {
      "Operates a virtual store on EZ Homesteading": true,
      "Lists produce for sale": true,
      "Sources from small organic gardens and farms": true,
      "Interacts directly with consumers": true,
      "Benefits from EZ Homesteading's support": true,
      "Doesn't deal with the hassle of bargaining and inventory management":
        true,
    },
  },
  producer: {
    name: "Producer",
    privileges: {
      "Operates a virtual store on EZ Homesteading": true,
      "Lists produce for sale": true,
      "Sells directly to consumers": false,
      "Benefits from EZ Homesteading's support": true,
      "Doesn't deal with the hassle of bartering & inventory": true,
    },
  },
};

export default function Example() {
  const [selectedRole, setSelectedRole] = useState<"co-op" | "producer">(
    "co-op"
  );

  return (
    <Card className="min-h-screen sm:py-32 flex items-center justify-center sheet px-4 py-4">
      <CardContent className="max-w-fit sheet shadow-2xl rounded-xl flex justify-center">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mt-2 font-bold tracking-tight text-gray-900 ">
              What Separates Co-ops and Producers?
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <RadioGroup
              value={selectedRole}
              onChange={setSelectedRole}
              className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
            >
              {Object.keys(roles).map((role) => (
                <RadioGroup.Option
                  key={role}
                  value={role}
                  className={({ checked }) =>
                    classNames(
                      checked && role === "co-op"
                        ? "bg-blue-600 text-white"
                        : "",
                      checked && role === "producer"
                        ? "bg-green-600 text-white"
                        : "",
                      !checked ? "text-gray-500" : "",
                      "cursor-pointer rounded-full px-2.5 py-1"
                    )
                  }
                >
                  <span>{roles[role].name}</span>
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>
          <div className=" mt-10 grid grid-cols-1 gap-8">
            {Object.keys(roles[selectedRole].privileges).map((privilege) => (
              <div key={privilege} className="flex gap-x-3 items-center">
                {roles[selectedRole].privileges[privilege] ? (
                  <CheckIcon
                    className={`h-6 w-6 ${
                      selectedRole === "co-op"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  />
                ) : (
                  <XIcon className="h-6 w-6 text-red-600" />
                )}
                <span
                  className={classNames(
                    roles[selectedRole].privileges[privilege]
                      ? "text-gray-900"
                      : "text-gray-600",
                    "text-lg font-semibold"
                  )}
                >
                  {privilege}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button"

function Navigation({ className }: any) {
  return (
    <React.Fragment>
      <div className={`flex justify-center w-full ${className}`}>
        <div className="flex flex-row">
          <div>
            <Button size="icon" className="rounded-[51%] bg-[#48A102] w-[60px] h-[60px]">
              <Image src="/account.svg"
                alt="" width={35} height={35} />
            </Button>
          </div>
          <div className="mt-[-19px]">
            <Button size="icon" className="rounded-[51%] ml-2 bg-[#48A102] w-[70px] h-[70px]">
              <Image src="/home.svg" alt="" height={35} width={35} />
            </Button>
          </div>
          <div>
            <Button size="icon" className="rounded-[50%] ml-2 bg-[#48A102] w-[60px] h-[60px]">
              <Image src="settings.svg" alt="" height={35} width={34} />
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Navigation;

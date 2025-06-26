// frontend/task-management/src/components/header.tsx
'use client';

import { PanelsTopLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modeToggle";
import { ExitIcon, PlusIcon } from "@radix-ui/react-icons";
import { logout } from '@/lib/auth';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export default function Header() {
  return (
    <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
      <div className="container h-14 flex items-center">
        <Link
          href="/"
          className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
        >
          <PanelsTopLeft className="w-6 h-6 mr-3" />
          <span className="font-bold">Dashboard</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Link href="/createTask">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-8 h-8 bg-background mr-2"
                  >
                    <PlusIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">Create new task</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full w-8 h-8 bg-background mr-2"
                  onClick={logout}
                >
                  <ExitIcon className="absolute w-[1.2rem] h-[1.2rem] rotate-90 scale-0 transition-transform ease-in-out duration-500 dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">LogOut</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

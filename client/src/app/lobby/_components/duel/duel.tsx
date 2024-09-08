import * as React from "react";
import Duelmode from "./duelmode";
import io from "socket.io-client";
import { useAppSelector, RootState } from "@/store/store";
import MatchSingle from "./match-single";
import { useRouter } from "next/navigation";

const socket = io("http://localhost:3001");

interface DuelMode {
  mode: string;
  credits: string;
}

interface Errors {
  credits: string;
  queue: string;
  playing: string;
}

interface UserData {
  id: string;
  username: string;
  avatar: string;
  bet: number;
}

const Duel = ({
  open,
  duelToggle,
}: any) => {
  const router = useRouter();

  const user = useAppSelector((state: RootState) => state.user);

  const [duelMode, setDuelMode] = React.useState<{ mode: string; credits: string } | null>(null);
  const [onQueue, setOnQueue] = React.useState(false);
  const [errors, setErrors] = React.useState<{ credits: string; queue: string; playing: string } | null>(null);

  const onDuelmode = (mode: string, credits: string) => {
    console.log(user)
    //setDuelMode({ mode, credits });
    //onSubmit({ mode, credits });
  }

  React.useEffect(() => {
    socket.on("exited", () => {
      console.log("exited");
    });

    socket.on("game_started", () => {
      router.push("/duelo");
    });

    return () => {
      socket.off("exited");
      socket.off("game_started");
    };
  }, []);

  function validateCredits(credits: string): boolean {
    const amount = parseFloat(credits);
    return !isNaN(amount) && amount > 0;
  }

  function onSubmit({ mode, credits }: { mode: string; credits: string }) {
    const room = mode;
    const bet = parseFloat(credits);

    if (!validateCredits(credits)) {
      console.error("Invalid bet amount");
      return;
    }

    const userdata = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bet: bet,
    }

    if (room) {
      socket.emit("join_queue", { room, userdata });
    }
  }

  const onDismiss = async () => {
    const userdata = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      bet: duelMode?.credits ? parseFloat(duelMode.credits) : 0,
      room: duelMode?.mode,
    }

    if (duelMode?.mode) {
      console.log("removing", userdata.id);
      socket.emit("leave_queue");
    }

    // Remove room from state
    duelToggle();
    setDuelMode(null);
    setOnQueue(false);
  }

  return (
    <React.Fragment>
      <div className={`
        fixed inset-0 flex justify-center items-center
        transition-colors
        ${open ? "visible bg-black/40" : "invisible"}
      `}>
        <div className={`
          text-white transition-all
          flex flex-col relative z-50 w-full box-border outline-none 
          mx-1 my-1 sm:mx-6 sm:my-16 max-w-md rounded-large 
          ${open ? "scale-100 opacity-100" : "scale-125 opacity-0"}
          ${!duelMode ? "bg-[transparent]" : "bg-[#9d6727] shadow-small rounded-lg"}
        `}>
          {/*Choose duel mode and bets*/}
          {!duelMode && (
            <Duelmode onMode={onDuelmode} duelToggle={duelToggle} />
          )}

          {/*1 vs 1*/}
          {duelMode && (
            <MatchSingle player={user} onDismiss={onDismiss} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Duel;

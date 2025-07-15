"use client";
import { useActionState, useEffect } from "react";
import { closeTicket } from "@/actions/tickets.actions";
import { toast } from "sonner";

const CloseTicketsButton = ({
  ticketId,
  isclosed,
}: {
  ticketId: number;
  isclosed: boolean;
}) => {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useActionState(closeTicket, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  if (isclosed) return null;
  return (
    <form action={formAction}>
      <input type="hidden" value={ticketId} name="ticketId" />
      <button
        type="submit"
        className="bg-red-700 text-white px-3 py-3 w-full rounded hover:bg-red-800 transition cursor-pointer"
      >
        Close Ticket
      </button>
    </form>
  );
};

export default CloseTicketsButton;

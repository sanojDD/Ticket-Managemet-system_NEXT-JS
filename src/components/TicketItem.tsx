import type { Ticket } from "@/generated/prisma";
import { getPriorityClass } from "@/utils/ui";
import Link from "next/link";

type TicketItemProps = {
  ticket: Ticket;
};

const TicketItem = ({ ticket }: TicketItemProps) => {
  const isclosed = ticket.status === "Closed";
  return (
    <div
      key={ticket.id}
      className={`flex justify-between items-center bg-white rounded-lg shadow border  border-gray-200 p-6 ${
        isclosed ? "opacity-50" : ""
      }`}
    >
      {/* left side */}
      <div>
        <h2 className="text-xl font-semibold text-blue-600">
          {ticket.subject}
        </h2>
      </div>
      {/* right side */}
      <div className="text-right space-y-2 ">
        <div className="text-sm text-gray-500 ">
          priority:{" "}
          <span className={getPriorityClass(ticket.priority)}>
            {ticket.priority}
          </span>
        </div>

        <Link
          href={`/tickets/${ticket.id}`}
          className={`inline-block mt-2 text-sm px-3 py-1 rounded hover:bg-blue-700 transition text-center ${
            isclosed
              ? " bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
              : " bg-blue-700 text-white hover:bg-blue-700"
          }`}
        >
          View Ticket
        </Link>
      </div>
    </div>
  );
};

export default TicketItem;

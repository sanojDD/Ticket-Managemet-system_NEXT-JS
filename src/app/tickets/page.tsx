import { getTickets } from "@/actions/tickets.actions";
import TicketItem from "@/components/TicketItem";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

const TicketsPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }
  const tickets = await getTickets();

  return (
    <div className="min-h-screen bg-blue-100 p-8 ">
      <h1 className="text-3xl font-bold  text-blue-600 mb-8 text-center">
        Support Tickets
      </h1>

      {tickets.length === 0 ? (
        <p className="text-center text-gray-600">No tickets Yet.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {tickets.map((ticket) => (
            <TicketItem key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;

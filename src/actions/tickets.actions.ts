"use server";

import * as Sentry from "@sentry/nextjs";
import {prisma} from "@/db/prisma"
import { revalidatePath } from "next/cache";
import { logEvent } from "@/utils/sentry";
import { getCurrentUser } from "@/lib/current-user";


export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {

    const user = await getCurrentUser();

    if(!user){
      logEvent("unauthorized user",'ticket', {},'warning');

      return{
        success:false,
        message:"Please login!!"
      }
    }
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    if (!subject || !description || !priority) {
      logEvent("validation error: missing ticket data fields","ticket",{subject, description, priority}, "warning")
      return {
        success: false,
        message: "All fields are required",
      };
    }

    // create a ticket
    const ticket = await prisma.ticket.create({
      data:{subject, description, priority, user:{
        connect:{id:user.id}
      }}
    })

  
    logEvent(`Ticket created successfully:${ticket.id}`,'ticket', {ticketId: ticket.id}, 'info')

    revalidatePath("/tickets");

    return {
      success: true,
      message: "Ticket created successfully",
    };

  } catch (error) {
    
    logEvent("An error occurred while creating the ticket", "ticket", {
      formData:Object.fromEntries(formData.entries())
    }, "error", error)
    return {
      success: false,
      message: "An error occurred while creating the ticket",
    };
  }
}



export async function getTickets(){


  try {

    const user = await getCurrentUser();
    if(!user){
      logEvent("unauthorized access", 'ticket', {},'warning');
      return[];
    }

    const tickets = await prisma.ticket.findMany({
      where:{userId: user.id},
      orderBy: {createdAt:"desc"}
    })
    
    logEvent("Fetched ticket list", "ticket", {count:tickets.length}, 'info');
    return tickets
  } catch (error) {
    logEvent("Error fetching the ticket",'ticket', {}, "error", error);
    return [];
    
  }
}

export async function getTicketById( id: string){
  try {

    const ticket = await prisma.ticket.findUnique({
      where:{
        id: Number(id)
      }
    })
    if(!ticket){
      logEvent("Ticket not found", "ticket", {id:id}, "warning");
    }
    return ticket;
    
  } catch (error) {

    logEvent("Error fetching the ticket", "ticket", {id: id}, "error", error);
    return null;
    
  }
}

// close ticket

export async function closeTicket(prevState:{success:boolean, message:string}, formData:FormData):Promise<{success: boolean, message:string}>{

  const ticketId = Number(formData.get('ticketId'));

  if(!ticketId){
    logEvent("missing ticketId", 'ticket', {}, 'warning');
    return {success:false, message:" ID is reduired for ticket"};
  }

  const user = await getCurrentUser();
  if (!user){
    logEvent("missing userID", 'ticket', {}, 'warning');
    return {success:false, message:"unauthorized"}
  }

  const ticket = await prisma.ticket.findUnique({where:{id: ticketId}});

  if(!ticket || ticket.userId !== user.id){
    logEvent("unauthorized attempt!",'ticket', {ticketId, userId:user.id}, 'warning');
    return {success:false, message:"You are not authorized to close this ticket!!!"}
  }

  await prisma.ticket.update({
    where:{id:ticketId},
    data:{status: "Closed"}
  });

  revalidatePath('/tickets');
  revalidatePath(`/tickets/${ticketId}`);

  return { success:true, message:"tickets closed successfully"}

}

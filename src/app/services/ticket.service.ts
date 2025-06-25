import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { Ticket, User } from "../models/ticket.model"
import { map } from "rxjs/operators"
@Injectable({
  providedIn: "root",
})
export class TicketService {
  private currentUserSubject = new BehaviorSubject<User>({
    name: "María González",
    email: "mgonzalez@empresa.cl",
    department: "Contabilidad",
    role: "user",
  })

  private ticketsSubject = new BehaviorSubject<Ticket[]>([
    {
      id: "TK-001",
      title: "Problema con impresora HP LaserJet",
      description: "La impresora no responde y muestra error de papel atascado",
      category: "hardware",
      priority: "medium",
      status: "open",
      requester: "mgonzalez@empresa.cl",
      assignee: "soporte@empresa.cl",
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
      department: "Contabilidad" // ← agregado
    },
    {
      id: "TK-002",
      title: "Acceso a sistema de contabilidad",
      description: "Necesito acceso al módulo de reportes del sistema contable",
      category: "access",
      priority: "high",
      status: "in-progress",
      requester: "pmartin@empresa.cl",
      assignee: "admin@empresa.cl",
      createdAt: new Date("2024-01-14T14:20:00"),
      updatedAt: new Date("2024-01-15T09:15:00"),
      department: "Contabilidad" // ← agregado
    },
  ])

  constructor() {}

  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable()
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user)
  }

  getTickets(): Observable<Ticket[]> {
    return this.ticketsSubject.asObservable()
  }

getTicketsByUser(userEmail: string): Observable<Ticket[]> {
  return this.ticketsSubject.pipe(
    map((tickets) => tickets.filter((ticket) => ticket.requester === userEmail))
  )
}

  addTicket(ticketData: Partial<Ticket>): void {
    const currentUser = this.currentUserSubject.value
    const newTicket: Ticket = {
      id: `TK-${String(Date.now()).slice(-3)}`,
      title: ticketData.title || "",
      description: ticketData.description || "",
      category: ticketData.category || "hardware",
      priority: ticketData.priority || "medium",
      status: "open",
      requester: currentUser.email,
      assignee: "soporte@empresa.cl",
      createdAt: new Date(),
      updatedAt: new Date(),
      department: currentUser.department // ← agregado
    }

    const currentTickets = this.ticketsSubject.value
    this.ticketsSubject.next([...currentTickets, newTicket])
  }
  
resolveTicket(id: string, comment: string): void {
  const currentTickets = this.ticketsSubject.value
  const updatedTickets: Ticket[] = currentTickets.map(ticket =>
    ticket.id === id
      ? {
          ...ticket,
          status: 'resolved' as const,
          updatedAt: new Date(),
          resolutionComment: comment
        }
      : ticket
  )
  this.ticketsSubject.next(updatedTickets)
}

}

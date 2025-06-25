import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { TicketService } from "../../services/ticket.service"
import { Ticket, User } from "../../models/ticket.model"
import { Observable } from "rxjs"
import { map, switchMap } from "rxjs/operators"

@Component({
  selector: "app-tickets",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.css"],
})
export class TicketsComponent implements OnInit {
  tickets$: Observable<Ticket[]>
  currentUser$: Observable<User>
  isAdmin$: Observable<boolean>
  searchQuery = ""
  statusFilter = "all"

  constructor(private ticketService: TicketService) {
    this.currentUser$ = this.ticketService.getCurrentUser()
    this.isAdmin$ = this.currentUser$.pipe(map(user => user.role === 'admin'))
    this.tickets$ = this.getVisibleTickets()
  }

  ngOnInit(): void {}

  private getVisibleTickets(): Observable<Ticket[]> {
    return this.currentUser$.pipe(
      switchMap((user) => {
        if (user.role === "admin") {
          return this.ticketService.getTickets()
        } else {
          return this.ticketService.getTicketsByUser(user.email)
        }
      }),
    )
  }

  getFilteredTickets(): Observable<Ticket[]> {
    return this.tickets$.pipe(
      map((tickets) =>
        tickets.filter((ticket) => {
          const matchesSearch =
            ticket.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            ticket.requester.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            ticket.id.includes(this.searchQuery)

          const matchesStatus = this.statusFilter === "all" || ticket.status === this.statusFilter

          return matchesSearch && matchesStatus
        }),
      ),
    )
  }

  getStatusCount(status: string): Observable<number> {
    return this.getFilteredTickets().pipe(map((tickets) => tickets.filter((t) => t.status === status).length))
  }

  getTotalCount(): Observable<number> {
    return this.getFilteredTickets().pipe(map((tickets) => tickets.length))
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      open: "Abierto",
      "in-progress": "En Progreso",
      resolved: "Resuelto",
      closed: "Cerrado",
    }
    return statusMap[status] || status
  }

  getPriorityText(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      urgent: "Urgente",
    }
    return priorityMap[priority] || priority
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      open: "badge-blue",
      "in-progress": "badge-yellow",
      resolved: "badge-green",
      closed: "badge-gray",
    }
    return colorMap[status] || "badge-gray"
  }

  getPriorityColor(priority: string): string {
    const colorMap: { [key: string]: string } = {
      urgent: "badge-red",
      high: "badge-orange",
      medium: "badge-yellow",
      low: "badge-green",
    }
    return colorMap[priority] || "badge-gray"
  }
}

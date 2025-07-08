import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router, RouterModule } from "@angular/router"
import { TicketService } from "../../services/ticket.service"
import { Ticket, TicketStats } from "../../models/ticket.model"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { User } from "../../models/user.model"
import { UserSessionService } from "../../services/user-session.service"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  usuario: User | null = null
  tickets$: Observable<Ticket[]>
  stats$: Observable<TicketStats>

  constructor(
    private userSession: UserSessionService,
    private router: Router,
    private ticketService: TicketService
  ) {
    this.tickets$ = this.ticketService.getTickets()
    this.stats$ = this.calculateStats()
  }

  ngOnInit(): void {
    this.usuario = this.userSession.getUsuarioActivo()

    if (!this.usuario || (this.usuario.role !== 'admin' && this.usuario.role !== 'support')) {
      this.router.navigate(['/unauthorized']);
    }

  }

  private calculateStats(): Observable<TicketStats> {
    return this.tickets$.pipe(
      map((tickets) => ({
        total: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        inProgress: tickets.filter((t) => t.status === "in-progress").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
        closed: tickets.filter((t) => t.status === "closed").length,
        urgent: tickets.filter((t) => t.priority === "urgent").length,
        high: tickets.filter((t) => t.priority === "high").length,
      }))
    )
  }

getRecentTickets(): Observable<Ticket[]> {
  return this.tickets$.pipe(
    map((tickets) =>
      [...tickets] // Clonamos el arreglo para evitar mutarlo
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    )
  );
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

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      open: "badge-blue",
      "in-progress": "badge-yellow",
      resolved: "badge-green",
      closed: "badge-gray",
    }
    return colorMap[status] || "badge-gray"
  }
}

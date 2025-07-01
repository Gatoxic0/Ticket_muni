import { Component, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TicketService } from "src/app/services/ticket.service";
import { UserSessionService } from "src/app/services/user-session.service";
import { Ticket } from "src/app/models/ticket.model";
import { User } from "src/app/models/user.model";

@Component({
  selector: "app-resolve-ticket",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./resolve-ticket.component.html",
  styleUrls: ["./resolve-ticket.component.css"],
})
export class ResolveTicketComponent implements OnDestroy {
  ticket!: Ticket;
  responses: { author: string; authorEmail: string; message: string; timestamp: Date }[] = [];
  newResponse = "";
  currentUser: User | null = null;
  adminUsers: User[] = [];

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private ticketService = inject(TicketService);
  private userSessionService = inject(UserSessionService);

  private destroy$ = new Subject<void>();

ngOnInit() {
  const id = this.route.snapshot.paramMap.get("id");
  const allTickets = this.ticketService.getAllTickets();
  this.ticket = allTickets.find((t) => t.id === id)!;

  if (!this.ticket) {
    this.router.navigate(["/tickets"]);
    return;
  }

  this.userSessionService.usuarioActivo$
    .pipe(takeUntil(this.destroy$))
    .subscribe((user) => {
      this.currentUser = user;
    });

  this.userSessionService.usuarios$
    .pipe(takeUntil(this.destroy$))
    .subscribe((usuarios: User[]) => {
      this.adminUsers = usuarios.filter((u) => u.role === "admin");
    });

  // 🔽 Intentar cargar respuestas guardadas en localStorage
  const storedResponses = localStorage.getItem(`ticket-responses-${this.ticket.id}`);
  if (storedResponses) {
    this.responses = JSON.parse(storedResponses).map((r: any) => ({
      ...r,
      timestamp: new Date(r.timestamp), // Restaurar tipo Date
    }));
  } else {
    // Si no hay respuestas guardadas, usar la respuesta inicial por defecto
    this.responses = [
      {
        author: "Administrador",
        authorEmail: "soporte@empresa.cl",
        message:
          "Hemos recibido tu solicitud. Estamos revisando el problema y te contactaremos pronto con una solución.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];

    // 🔽 Guardar en localStorage inmediatamente para persistencia futura
    localStorage.setItem(
      `ticket-responses-${this.ticket.id}`,
      JSON.stringify(this.responses)
    );
  }
}


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.location.back();
  }

addResponse() {
  if (!this.newResponse.trim() || !this.currentUser) return;

  const newMsg = {
    author: this.currentUser.name,
    authorEmail: this.currentUser.email,
    message: this.newResponse,
    timestamp: new Date(),
  };

  this.responses.push(newMsg);

  // Guardar en Local Storage
  localStorage.setItem(`ticket-responses-${this.ticket.id}`, JSON.stringify(this.responses));

  this.newResponse = "";
}


  saveChanges() {
    this.ticket.updatedAt = new Date();
    this.ticketService.updateTicket(this.ticket);
    alert("Ticket actualizado exitosamente");
  }

  formatDate(date: Date): string {
    const now = new Date();
    const ticketDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - ticketDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return "hace unos minutos";
    } else if (diffInHours < 24) {
      return `hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
    } else {
      return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(ticketDate);
    }
  }

  formatFullDate(date: Date): string {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  getInitials(name?: string): string {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase();
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      open: "Abierto",
      "in-progress": "En Progreso",
      resolved: "Resuelto",
    };
    return statusMap[status] || status;
  }

  getPriorityText(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      urgent: "Urgente",
      high: "Alta",
      medium: "Media",
      low: "Baja",
    };
    return priorityMap[priority] || priority;
  }

  getCategoryText(category: string): string {
    const categoryMap: { [key: string]: string } = {
      hardware: "Hardware",
      software: "Software",
      network: "Red/Internet",
      access: "Accesos",
    };
    return categoryMap[category] || category;
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      open: "status-open",
      "in-progress": "status-in-progress",
      resolved: "status-resolved",
    };
    return classMap[status] || "status-open";
  }

  getPriorityClass(priority: string): string {
    const classMap: { [key: string]: string } = {
      urgent: "priority-urgent",
      high: "priority-high",
      medium: "priority-medium",
      low: "priority-low",
    };
    return classMap[priority] || "priority-medium";
  }
}

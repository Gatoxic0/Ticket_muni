import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { TicketService } from "src/app/services/ticket.service";
import { Ticket } from "src/app/models/ticket.model";
import { User } from "src/app/models/user.model";

@Component({
  selector: "app-resolve-ticket",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./resolve-ticket.component.html",
  styleUrls: ["./resolve-ticket.component.css"],
})
export class ResolveTicketComponent {
  ticket!: Ticket;
  responses: { author: string; message: string; timestamp: Date }[] = [];
  newResponse = "";

users: User[] = [
  { name: "María González", email: "mgonzalez@empresa.cl", role: "user", department: "Contabilidad" },
  { name: "Pedro Martín", email: "pmartin@empresa.cl", role: "user", department: "Ventas" },
  // agrega todos los usuarios que usas en la app
];


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private ticketService = inject(TicketService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    const allTickets = this.ticketService.getAllTickets();
    this.ticket = allTickets.find((t) => t.id === id)!;

    if (!this.ticket) {
      this.router.navigate(["/tickets"]);
      return;
    }

    // Simular respuestas existentes
    this.responses = [
      {
        author: "soporte@empresa.cl",
        message:
          "Hemos recibido tu solicitud. Estamos revisando el problema y te contactaremos pronto con una solución.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      },
    ];
  }

  goBack(): void {
    this.location.back();
  }

  addResponse() {
    if (!this.newResponse.trim()) return;

    this.responses.push({
      author: "soporte@empresa.cl",
      message: this.newResponse,
      timestamp: new Date(),
    });
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

  getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

getUserEmail(name: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, ".");
  return `${cleanName}`;
}

getNameFromEmail(email: string): string {
  if (!email) return "";

  const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    return user.name; // Retorna el nombre completo correcto
  }

  // Si no lo encuentra, intenta obtener un nombre básico del email
  const namePart = email.split("@")[0];
  const nameWords = namePart.split(".");
  return nameWords
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}




  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      open: "Abierto",
      "in-progress": "En Progreso",
      resolved: "Resuelto",
      closed: "Cerrado",
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
      closed: "status-closed",
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

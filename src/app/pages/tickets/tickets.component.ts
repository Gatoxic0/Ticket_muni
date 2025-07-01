import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TicketService } from '../../services/ticket.service';
import { UserSessionService } from '../../services/user-session.service';
import { Ticket } from '../../models/ticket.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  tickets$: Observable<Ticket[]>;      // Observable con los tickets (filtrados)
  currentUser$: Observable<User | null>;
  isAdmin$: Observable<boolean>;

  searchQuery = '';
  statusFilter = 'all';

  constructor(
    private ticketService: TicketService,
    private session: UserSessionService
  ) {
    this.currentUser$ = this.session.usuarioActivo$;
    this.isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'admin'));

    // Inicializamos tickets$ para que cambie cuando cambie usuario, filtro o búsqueda
    this.tickets$ = combineLatest([
      this.ticketService.getTickets(),    // Todos los tickets reactivos
      this.currentUser$                   // Usuario actual reactivo
    ]).pipe(
      map(([tickets, user]) => {
        if (!user) return [];
        if (user.role === 'admin') return tickets; // Admin ve todo
        // Usuario normal ve solo sus tickets
        return tickets.filter(t => t.requesterEmail === user.email);
      })
    );
  }

  ngOnInit(): void {}

  // Observable con tickets filtrados por búsqueda y estado (reactivo)
getFilteredTickets(): Observable<Ticket[]> {
  return this.tickets$.pipe(
    map(tickets =>
      tickets
        .filter(ticket => {
          const query = this.searchQuery.toLowerCase();
          const matchesSearch =
            ticket.title.toLowerCase().includes(query) ||
            ticket.requesterEmail?.toLowerCase().includes(query) ||
            ticket.id.includes(query) ||
            (ticket.assignee?.toLowerCase().includes(query) ?? false);

          const matchesStatus =
            this.statusFilter === 'all' || ticket.status === this.statusFilter;

          return matchesSearch && matchesStatus;
        })
        // Ordenar por fecha DESC (más reciente primero)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    )
  );
}


  getStatusCount(status: string): Observable<number> {
    return this.getFilteredTickets().pipe(
      map(tickets => tickets.filter(t => t.status === status).length)
    );
  }

  getTotalCount(): Observable<number> {
    return this.getFilteredTickets().pipe(map(tickets => tickets.length));
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const dt = new Date(date);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dt);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      open: 'Abierto',
      'in-progress': 'En Progreso',
      resolved: 'Resuelto',
      closed: 'Cerrado',
    };
    return statusMap[status] || status;
  }

  getPriorityText(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    };
    return priorityMap[priority] || priority;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      open: 'badge-blue',
      'in-progress': 'badge-yellow',
      resolved: 'badge-green',
      closed: 'badge-gray',
    };
    return colorMap[status] || 'badge-gray';
  }

  getPriorityColor(priority: string): string {
    const colorMap: { [key: string]: string } = {
      urgent: 'badge-red',
      high: 'badge-orange',
      medium: 'badge-yellow',
      low: 'badge-green',
    };
    return colorMap[priority] || 'badge-gray';
  }

  getAssigneeInitials(assignee?: string): string {
    if (!assignee) return 'SA';

    if (assignee.includes('@')) {
      const name = assignee.split('@')[0];
      return name.substring(0, 2).toUpperCase();
    }

    const names = assignee.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }

    return assignee.substring(0, 2).toUpperCase();
  }

  getAssigneeName(assignee?: string): string {
    if (!assignee) return 'Sin asignar';

    if (assignee.includes('@')) {
      const name = assignee.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return assignee;
  }

  getAssigneeColor(assignee?: string): string {
    if (!assignee) return 'bg-gray-400';

    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
    ];

    let hash = 0;
    for (let i = 0; i < assignee.length; i++) {
      hash = assignee.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  }
}

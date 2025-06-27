import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ticket } from '../models/ticket.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private currentUserSubject = new BehaviorSubject<User>({
    name: 'Maria Gonzales',
    email: 'usuario@empresa.cl',
    department: 'Soporte',
    role: 'user' // 👈 Esto soluciona el error
  });


  constructor() {
    const loaded = this.loadTicketsFromStorage();
    if (loaded.length) this.ticketsSubject.next(loaded);
  }

  private loadTicketsFromStorage(): Ticket[] {
    const data = localStorage.getItem('tickets');
    return data ? JSON.parse(data) : [];
  }

  private saveTicketsToStorage(tickets: Ticket[]): void {
    localStorage.setItem('tickets', JSON.stringify(tickets));
  }

  getAllTickets(): Ticket[] {
    return this.ticketsSubject.value;
  }

  getTickets(): Observable<Ticket[]> {
    return this.ticketsSubject.asObservable();
  }

  getTicketsByUser(email: string): Observable<Ticket[]> {
    return this.ticketsSubject.asObservable().pipe(
      map((tickets) => tickets.filter(t => t.requester === email))
    );
  }

  getCurrentUser(): Observable<User> {
    return this.currentUserSubject.asObservable();
  }
  getCurrentUserValue(): User {
    return this.currentUserSubject.value;
}


  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  addTicket(ticketData: Partial<Ticket>): void {
    const currentUser = this.currentUserSubject.value;
    const newTicket: Ticket = {
      id: `TK-${String(Date.now()).slice(-3)}`,
      title: ticketData.title || '',
      description: ticketData.description || '',
      category: ticketData.category || 'hardware',
      priority: ticketData.priority || 'media',
      status: 'open',
      requester: currentUser.email,
      assignee: 'soporte@empresa.cl',
      createdAt: new Date(),
      updatedAt: new Date(),
      department: currentUser.department,
    };
    const updatedTickets = [...this.ticketsSubject.value, newTicket];
    this.ticketsSubject.next(updatedTickets);
    this.saveTicketsToStorage(updatedTickets);
  }

  updateTicket(updated: Ticket): void {
    const updatedTickets = this.ticketsSubject.value.map((t) =>
      t.id === updated.id ? updated : t
    );
    this.ticketsSubject.next(updatedTickets);
    this.saveTicketsToStorage(updatedTickets);
  }
}

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { TicketService } from '../../services/ticket.service'
import { Ticket } from '../../models/ticket.model'

@Component({
  standalone: true,
  selector: 'app-resolve-ticket',
  imports: [CommonModule, FormsModule],
  templateUrl: './resolve-ticket.component.html'
})
export class ResolveTicketComponent implements OnInit {
  ticket?: Ticket
  resolutionComment: string = ''

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id')
    this.ticketService.getTickets().subscribe(tickets => {
      this.ticket = tickets.find(t => t.id === ticketId)
    })
  }

  resolveTicket(): void {
    if (this.ticket) {
      this.ticketService.resolveTicket(this.ticket.id, this.resolutionComment)
      this.router.navigate(['/tickets']) // redirige al listado
    }
  }
}

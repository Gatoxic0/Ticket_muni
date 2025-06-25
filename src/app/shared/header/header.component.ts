import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { TicketService } from "../../services/ticket.service"
import { User } from "../../models/ticket.model"
import { Observable } from "rxjs"
import { take } from 'rxjs/operators'
@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User>
  showUserMenu = false

  constructor(private ticketService: TicketService) {
    this.currentUser$ = this.ticketService.getCurrentUser()
  }

  ngOnInit(): void {}

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu
  }

toggleRole(): void {
  this.currentUser$.pipe(take(1)).subscribe((user) => {
    const newRole = user.role === "admin" ? "user" : "admin"
    this.ticketService.setCurrentUser({ ...user, role: newRole })
    this.showUserMenu = false
  })
}

switchUser(): void {
  this.currentUser$.pipe(take(1)).subscribe((user) => {
    const newUser = user.email === "mgonzalez@empresa.cl"
      ? {
          name: "Pedro Martín",
          email: "pmartin@empresa.cl",
          department: "Ventas",
          role: "user" as const,
        }
      : {
          name: "María González",
          email: "mgonzalez@empresa.cl",
          department: "Contabilidad",
          role: "user" as const,
        }

    this.ticketService.setCurrentUser(newUser)
    this.showUserMenu = false
  })
}
}

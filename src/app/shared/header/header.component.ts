import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { User } from "../../models/user.model"
import { UserSessionService } from "../../services/user-session.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  usuario: User | null = null
  showUserMenu = false

  constructor(private userSession: UserSessionService) {}

  ngOnInit(): void {
    this.usuario = this.userSession.getUsuarioActivo()
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu
  }

  logout(): void {
    this.userSession.logout()
    location.reload()
  }
}

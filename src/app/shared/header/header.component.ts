import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserSessionService } from '../../services/user-session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  usuario: User | null = null;
  showUserMenu = false;
  private sub!: Subscription;

  constructor(
    private userSession: UserSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.userSession.usuarioActivo$.subscribe(user => {
      this.usuario = user;
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.userSession.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  
  goToRegister(): void {
  this.router.navigate(['/register']);
}

}

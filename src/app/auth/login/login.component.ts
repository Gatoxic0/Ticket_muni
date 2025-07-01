import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  mensaje = '';

  constructor(
    private authService: AuthService,
    private session: UserSessionService,
    private router: Router) {}

  login() {
    const usuario = this.authService.login(this.email);
    if (usuario) {
      this.session.setUsuarioActivo(usuario);
      this.router.navigate(['/tickets']); // redirigir tras login
    } else {
      alert('Usuario no encontrado');
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    const usuario = this.authService.login(this.email);
    if (usuario) {
      this.mensaje = 'Sesión iniciada 🎉';
      sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario))
      ;
      this.router.navigate(['/tickets']);
    } else {
      this.mensaje = 'Correo no registrado ❌';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  user: User = {
    name: '',
    email: '',
    role: 'user',
    department: ''
  };
  mensaje = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    const exito = this.authService.registrar(this.user);
    if (exito) {
      this.mensaje = 'Registro exitoso 🎉';
      this.router.navigate(['/login']);
    } else {
      this.mensaje = 'Este correo ya está registrado ⚠️';
    }
  }
}

import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localKey = 'usuarios';

  constructor() {}

  registrar(usuario: User): boolean {
    const usuarios = this.getUsuarios();
    const existe = usuarios.some(u => u.email === usuario.email);
    if (existe) return false;

    usuarios.push(usuario);
    localStorage.setItem(this.localKey, JSON.stringify(usuarios));
    return true;
  }

  login(email: string): User | null {
    const usuarios = this.getUsuarios();
    return usuarios.find(u => u.email === email) || null;
  }

  getUsuarios(): User[] {
    const data = localStorage.getItem(this.localKey);
    return data ? JSON.parse(data) : [];
  }
}

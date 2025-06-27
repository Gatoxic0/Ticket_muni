// user-session.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private readonly STORAGE_KEY = 'usuario_activo';

  getUsuarioActivo(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

    setUsuarioActivo(usuario: User): void {
    localStorage.setItem('usuario_activo', JSON.stringify(usuario));
    }


  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

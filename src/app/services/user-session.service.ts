import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private usuarioSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());

  constructor() {}

  private loadUserFromStorage(): User | null {
    const data = localStorage.getItem('usuarioActivo');
    return data ? JSON.parse(data) : null;
  }

  get usuarioActivo$(): Observable<User | null> {
    return this.usuarioSubject.asObservable();
  }

  // ✅ Este método sirve para obtener el valor actual (sincrónico)
  getUsuarioActivo(): User | null {
    return this.usuarioSubject.getValue();
  }

  // ✅ Renombrado a "setUsuarioActivo" para coincidir con lo que usas en otros archivos
  setUsuarioActivo(user: User): void {
    localStorage.setItem('usuarioActivo', JSON.stringify(user));
    this.usuarioSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem('usuarioActivo');
    this.usuarioSubject.next(null);
  }
}

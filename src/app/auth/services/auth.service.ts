import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.baseUrl;
  private _auth: Auth | undefined;

  constructor(
    private http: HttpClient
  ) { }

  verificarAutenticacion(): Observable<boolean>  {
    if (!localStorage.getItem('token')) {
      return of(false);
    }
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`).pipe(
      map<Auth, boolean>(auth => {
        this._auth = auth;
        return true;
      })
    )
  }

  login(): Observable<Auth> {
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`).pipe(
      tap(res => this._auth = res),
      tap(res => localStorage.setItem('token', res.id))
    )
  }

  get auth() {
    return {...this._auth};
  }

  logout() {
    localStorage.removeItem('token');
    this._auth = undefined;
  }
}

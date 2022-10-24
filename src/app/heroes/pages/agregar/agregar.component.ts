import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroe.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img {
      width: 100%;
      border-radius: 5px;
    }
  `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'Dc - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: ''
  };

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params.pipe(
      switchMap(({id}) => this.heroesService.getHeroe(id))
    ).subscribe({
      next: heroe => this.heroe = heroe
    })
  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }
    if (this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe).subscribe({
        next: heroe => {
          this.heroe = heroe
          this.mostrarSnackBar('Registro actualizado');
        }
      })
    } else {
      this.heroesService.agregarHeroe(this.heroe).subscribe({
        next: heroe => {
          this.mostrarSnackBar('Registro creado correctamente');
          this.router.navigate(['/heroes/editar', heroe.id])
        }
      })
    }
    /*this.heroesService.agregarHeroe(this.heroe).subscribe({
      next: heroe => console.log(heroe)
    })*/

  }

  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: { ...this.heroe }
    })
    dialog.afterClosed().pipe(
      filter(res => res),
      switchMap(() => this.heroesService.borrarHeroe(this.heroe.id!))
    ).subscribe({
      next: () => this.router.navigate(['/heroes'])
    })
  }

  mostrarSnackBar(mensaje: string): void {
    this._snackBar.open(mensaje, 'OK!', {
      duration: 2500
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { MenuItem, Message } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthService, Usuario } from '../core/services/auth.service';
import { AlumnoService } from '../core/services/alumno.service';

export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit{
  items!: MenuItem[];
  products: Product[];
  responsiveOptions: any[];
  messages1!: Message[];
  isLogged:boolean=false;
  // authUser$:Observable<Usuario | null>;
  idEstudiante!:number;
  estudiante:any;
  constructor( private authService:AuthService, private alumnosService:AlumnoService
    ) {

    this.products=[]
    this.items = [
      {
          label: 'File',
          icon: 'pi pi-fw pi-file',
          items: [
              {
                  label: 'New',
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {
                          label: 'Bookmark',
                          icon: 'pi pi-fw pi-bookmark'
                      },
                      {
                          label: 'Video',
                          icon: 'pi pi-fw pi-video'
                      }
                  ]
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-fw pi-trash'
              },
              {
                  separator: true
              },
              {
                  label: 'Export',
                  icon: 'pi pi-fw pi-external-link'
              }
          ]
      },
      {
          label: 'Edit',
          icon: 'pi pi-fw pi-pencil',
          items: [
              {
                  label: 'Left',
                  icon: 'pi pi-fw pi-align-left'
              },
              {
                  label: 'Right',
                  icon: 'pi pi-fw pi-align-right'
              },
              {
                  label: 'Center',
                  icon: 'pi pi-fw pi-align-center'
              },
              {
                  label: 'Justify',
                  icon: 'pi pi-fw pi-align-justify'
              }
          ]
      },
      {
          label: 'Users',
          icon: 'pi pi-fw pi-user',
          items: [
              {
                  label: 'New',
                  icon: 'pi pi-fw pi-user-plus'
              },
              {
                  label: 'Delete',
                  icon: 'pi pi-fw pi-user-minus'
              },
              {
                  label: 'Search',
                  icon: 'pi pi-fw pi-users',
                  items: [
                      {
                          label: 'Filter',
                          icon: 'pi pi-fw pi-filter',
                          items: [
                              {
                                  label: 'Print',
                                  icon: 'pi pi-fw pi-print'
                              }
                          ]
                      },
                      {
                          icon: 'pi pi-fw pi-bars',
                          label: 'List'
                      }
                  ]
              }
          ]
      },
      {
          label: 'Events',
          icon: 'pi pi-fw pi-calendar',
          items: [
              {
                  label: 'Edit',
                  icon: 'pi pi-fw pi-pencil',
                  items: [
                      {
                          label: 'Save',
                          icon: 'pi pi-fw pi-calendar-plus'
                      },
                      {
                          label: 'Delete',
                          icon: 'pi pi-fw pi-calendar-minus'
                      }
                  ]
              },
              {
                  label: 'Archieve',
                  icon: 'pi pi-fw pi-calendar-times',
                  items: [
                      {
                          label: 'Remove',
                          icon: 'pi pi-fw pi-calendar-minus'
                      }
                  ]
              }
          ]
      },
      {
          label: 'Quit',
          icon: 'pi pi-fw pi-power-off'
      }
    ];
    this.responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];
    this.messages1 = [{ severity: 'success', summary: 'Success', detail: 'Message Content' }];
    // TODO: comprobamos que tenga el token
    this.authService.verificarToken().subscribe(
      (userLogueado) => {
        this.isLogged = userLogueado
        if(this.isLogged){
          this.authService.obtenerUsuarioAutenticado().subscribe(
            (authUser) => {
              if(authUser){

                this.idEstudiante = authUser!.idEstudiante!;
                console.log('this.idEstudiante ::: ', this.idEstudiante );
                this.alumnosService.getEstudiantePorId(this.idEstudiante)
                .subscribe(estudiante => {
                  // console.log('estudiante::: ', estudiante);
                  // Agrega el objeto alumno a la lista
this.estudiante = estudiante;
                    console.log('this.estudiante::: ', this.estudiante);


                });

              }
            }
          )

        }


      });


  }
  ngOnInit(): void {

  }
  login(){
    console.log('login');

  }

  logout(){
    // this.router.navigate(['auth','login'])
    console.log('logout');
    this.authService.logout()
    this.authService.verificarToken().subscribe( userLogueado => this.isLogged = userLogueado);
    }
  getSeverity(status: string) {
    if (status === 'LOWSTOCK') {
      return 'warn';
    } else if (status === 'INSTOCK') {
      return 'success';
    } else if (status === 'OUTOFSTOCK') {
      return 'danger';
    }

    // Add a default return value
    return 'info';
  }
}


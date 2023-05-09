import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { PagesComponent } from './pages/pages.component';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { StyleLoaderService } from '../core/services/style-loader.service';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { MessagesModule } from 'primeng/messages';
import { ChipModule } from 'primeng/chip';
@NgModule({
  declarations: [
    LandingComponent,
    PagesComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    ButtonModule,
    MenubarModule,
    CarouselModule,
    TagModule,
    CardModule,
    MessagesModule,
    ChipModule

  ],
  providers: [StyleLoaderService]

})
export class LandingModule {
  constructor(private styleLoaderService: StyleLoaderService) {
    this.styleLoaderService.loadStyles([
      './assets/theme/vela.css',
      './assets/theme/primeng.min.css',
      './assets/theme/primeicons/primeicons.css',
    ]);
  }
 }

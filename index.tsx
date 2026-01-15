
import '@angular/compiler';
import './src/styles.css';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { AppComponent } from './src/app.component';
import { HomeComponent } from './src/components/home.component';
import { AdminComponent } from './src/components/admin.component';
import { EHundiComponent } from './src/components/ehundi.component';
import { GalleryComponent } from './src/components/gallery.component';
import { FeedbackComponent } from './src/components/feedback.component';
import { LibraryComponent } from './src/components/library.component';
import { HistoryComponent } from './src/components/history.component';
import { BookingComponent } from './src/components/booking.component';
import { DigitalDarshanComponent } from './src/components/digital-darshan.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'e-hundi', component: EHundiComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'feedback', component: FeedbackComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'digital-darshan', component: DigitalDarshanComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation())
  ]
}).catch(err => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.
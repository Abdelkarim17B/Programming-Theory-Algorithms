import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ArticulationComponent } from './app/components/articulation/articulation.component';

bootstrapApplication(ArticulationComponent, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));

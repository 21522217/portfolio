import { Component, ViewEncapsulation } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';

import { HeroComponent } from './sections/pages/home/sections/hero/hero.component';
import { SkillsComponent } from './sections/pages/home/sections/skills/skills.component';
import { JourneyComponent } from './sections/pages/home/sections/journey/journey.component';
import { SchoolComponent } from './sections/pages/home/sections/school/school.component';
import { WorkComponent } from './sections/pages/home/sections/work/work.component';
import { ContactComponent } from './sections/pages/home/sections/contact/contact.component';
import { FullpageScrollDirective } from "./sections/shared/directives/fullpage-scroll.directive";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AvatarModule,
    HeroComponent,
    SkillsComponent,
    JourneyComponent,
    SchoolComponent,
    WorkComponent,
    ContactComponent,
    FullpageScrollDirective
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent {}

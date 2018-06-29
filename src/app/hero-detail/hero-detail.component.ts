import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { states, Hero, Address } from '../data-model'
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnChanges {
  heroForm: FormGroup;
  states = states;
  @Input() hero: Hero;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): any {
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      address: this.fb.group(new Address()),
      power: '',
      sidekick: ''
    })
  }

  ngOnChanges(): void {
    this.rebuildForm();
  }

  rebuildForm() {
    this.heroForm.reset({
      name: this.hero.name,
      address: this.hero.addresses[0] || new Address(),
    });
  }
}

import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { states, Hero, Address } from '../data-model'
import { HeroService } from '../hero.service'
@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnChanges {
  heroForm: FormGroup;
  states = states;
  @Input() hero: Hero;
  nameChangeLog: string[] = [];

  constructor(private fb: FormBuilder, private heroService: HeroService) {
    this.createForm();
    this.logNameChange();
  }

  createForm(): any {
    this.heroForm = this.fb.group({
      name: ['', Validators.required],
      //address: this.fb.group(new Address()),
      secretLairs: this.fb.array([]),
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
    });
    this.setAddresses(this.hero.addresses);
  }

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.heroForm.setControl('secretLairs', addressFormArray);
  }

  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray;
  };

  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }

  removeLair(index: number) {
    this.secretLairs.removeAt(index);
  }

  logNameChange() {
    var control = this.heroForm.get('name');
    control.valueChanges.forEach((value: string) => this.nameChangeLog.push(value));
  }

  onSubmit() {
    this.hero = this.prepareSave();
    this.heroService.updateHero(this.hero).subscribe(/* error hanndleing */);
    this.rebuildForm();
  }

  prepareSave(): Hero {
    const formModel = this.heroForm.value;
    const addresses = formModel.secretLairs.map((address: Address) => Object.assign({}, address));
    const newHero: Hero = {
      id: this.hero.id,
      name: formModel.name,
      addresses: addresses
    };
    return newHero;
  }

  revert() {
    this.rebuildForm();
  }
}

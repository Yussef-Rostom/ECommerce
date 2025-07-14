import { Component } from '@angular/core';
import {Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm : FormGroup;

  constructor(private fb: FormBuilder, private router: Router){
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      username: ['', [Validators.required, Validators.pattern(/^\S*$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[*@%$#])[A-Za-z\d*@%$#]{8,}$/)]],
    })
  }

  get formControls(){
    return this.registerForm.controls;
  }

  onRegister(){
    if (this.registerForm.valid){
      console.log(this.registerForm.value);
      this.router.navigate(['/']);
      return;
    }
    alert('enter valid mail and password');
  }
}

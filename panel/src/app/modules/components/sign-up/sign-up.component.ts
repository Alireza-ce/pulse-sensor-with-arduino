import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';
import { ApiService } from './../../services/api.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  name = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  options: AnimationOptions = {
    path: '/assets/character.json',
  };

  optionsHeart: AnimationOptions = {
    path: '/assets/heartbeat.json',
  };

  constructor(
    private apiService: ApiService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  submit() {
    this.apiService
      .signUp({ email: this.email.value, password: this.password.value , name:this.name.value })
      .subscribe(
        (data) => {
          //localStorage.setItem('email',this.email.value);
          // this.router.navigate(['/panel'])
        },
        (error) => {
          this.snackBarService.showSnackBar(
            'ایمیل در سیستم ثبت شده است!!',
            'warn',
            4000
          );
        }
      );
  }
}
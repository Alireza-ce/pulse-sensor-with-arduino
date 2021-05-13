import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackBarService } from '../../services/snack-bar.service';
import { ApiService } from './../../services/api.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  serial = new FormControl('',[Validators.required,Validators.maxLength(8),Validators.minLength(8)]);
  options: AnimationOptions = {
    path: '/assets/character.json',
  };

  optionsHeart:AnimationOptions = {
    path: '/assets/heartbeat.json',
  };
 
  constructor(private apiService: ApiService,private snackBarService:SnackBarService,private router:Router) { }

  ngOnInit(): void {
  }

  submit() {
    if(this.serial.invalid){
      this.snackBarService.showSnackBar('شماره سریال دستگاه اشتباه می باشد', 'warn', 4000);
      return;
    }
    this.apiService.checkSerial({device_id:this.serial.value}).subscribe(data =>{
      localStorage.setItem('serial',this.serial.value);
      this.router.navigate(['/panel'])
    },error =>{
      this.snackBarService.showSnackBar('شماره سریال دستگاه اشتباه می باشد', 'warn', 4000);
    })
  }

}

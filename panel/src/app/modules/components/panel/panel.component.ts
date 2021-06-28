import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { ApiService } from '../../services/api.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  userName = localStorage.getItem('name');
  numberBpm = new FormControl('', [Validators.required, Validators.max(100), Validators.min(10)]);
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  optionsHeart: AnimationOptions = {
    path: '/assets/heartbeat.json',
  };

  constructor(private apiService: ApiService, private snackBarService: SnackBarService, private router: Router) { }

  ngOnInit(): void {
  }

  submitDate() {
    console.log( this.range.get('end').value)
    this.apiService.getFromDate({
      to_date: this.range.get('end').value,
      from_date: this.range.get('start').value,
      email: localStorage.getItem('email')
    }).subscribe(data => {
      console.log(data)
      if (data.length < 1) {
        this.snackBarService.showSnackBar('در این تاریخ اطلاعاتی ثبت نشده است', 'warn', 4000);
      } else {
        localStorage.setItem("bpmList", JSON.stringify(data));
        this.router.navigate(['/analysis'])
      }
    })
  }

  submitNumber() {
    if (this.numberBpm.invalid) {
      this.snackBarService.showSnackBar('عدد وارد شده در بازه مشخص شده نمی باشد', 'warn', 4000);
      return;
    }
    this.apiService.checkSerial({ email: localStorage.getItem('email') }).subscribe(data => {
      let bpmList = [];
      for (let i = data.length-1; i > 0; i--) {

       if((data.length > this.numberBpm.value)&& (i+1 > Math.abs(data.length - this.numberBpm.value))){
        bpmList.push(data[i])
        console.log(i)
       }else if(data.length <= this.numberBpm.value){
        localStorage.setItem("bpmList", JSON.stringify(data));
        this.router.navigate(['/analysis'])
        return
       }
        
      }
      bpmList.reverse();
      localStorage.setItem("bpmList", JSON.stringify(bpmList));
      this.router.navigate(['/analysis'])
    })

  }

}

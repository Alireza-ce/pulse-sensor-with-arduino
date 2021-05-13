import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  bpm;
  isHealth:boolean;
  titleMessage:string;

  optionsHeart:AnimationOptions = {
    path: '/assets/thinking-animation1.json',
  };
  
  optionsAdvise:AnimationOptions = {
    path: '/assets/1ealth-joy-character-waving.json',
  };

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.bpm = this.route.snapshot.params.id;
    this.analysisBPM();
  }

  analysisBPM(){
    if((this.bpm > 59 && this.bpm <101)|| (this.bpm > 39 && this.route.snapshot.params.isChecked == 'true' && this.bpm <101)){
      this.titleMessage = 'تبریک. شما داری ضربان قلب نرمالی می باشید'
      this.isHealth = true;
    }else{
      this.titleMessage = 'متاسفانه ضربان قلب شما غیر نرمال می باشد';
      this.isHealth = false;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  submitDate() {
    this.apiService.getFromDate({
      to_date: this.range.get('end').value,
      from_date: this.range.get('start').value,
      device_id: localStorage.getItem('serial')
    }).subscribe(data => {
      console.log(data)
      if(data.length < 0){
        //show snack bar
      }
    })
  }

}

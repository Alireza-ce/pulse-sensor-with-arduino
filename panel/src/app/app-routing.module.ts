import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './modules/components/login/login.component';
import { PanelComponent } from './modules/components/panel/panel.component';
import { AnalysisComponent } from './modules/components/analysis/analysis.component';
import { DetailComponent } from './modules/components/detail/detail.component';
import { SignUpComponent } from './modules/components/sign-up/sign-up.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'panel',
    component: PanelComponent,
  },
  {
    path: 'analysis',
    component: AnalysisComponent,
  },
  {
    path: 'detail/:id/:isChecked',
    component: DetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

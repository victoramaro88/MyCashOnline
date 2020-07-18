import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {ButtonModule} from 'primeng/button';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {DropdownModule} from 'primeng/dropdown';
import {InputMaskModule} from 'primeng/inputmask';
import {CalendarModule} from 'primeng/calendar';
import {BlockUIModule} from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { PanelMenuModule } from 'primeng/panelmenu';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NgxMaskModule, IConfig } from 'ngx-mask';
import { LoginComponent } from './Paginas/login/login.component';
import { SpinnerloadComponent } from './Paginas/Comuns/spinnerload/spinnerload.component';
import { UsuarioComponent } from './Paginas/Cadastros/usuario/usuario.component';
import { MasterComponent } from './Paginas/Layout/master/master.component';
import { MenuLateralComponent } from './Paginas/Layout/menu-lateral/menu-lateral.component';
import { MenuSuperiorComponent } from './Paginas/Layout/menu-superior/menu-superior.component';
import { RodapeComponent } from './Paginas/Layout/rodape/rodape.component';
import { HomeComponent } from './Paginas/home/home.component';
import { CadCartaoComponent } from './Paginas/Cadastros/cad-cartao/cad-cartao.component';
import { NovoLancamentoComponent } from './Paginas/novo-lancamento/novo-lancamento.component';
import { EditarUsuarioComponent } from './Paginas/Cadastros/editar-usuario/editar-usuario.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerloadComponent,
    UsuarioComponent,
    MasterComponent,
    MenuLateralComponent,
    MenuSuperiorComponent,
    RodapeComponent,
    HomeComponent,
    CadCartaoComponent,
    NovoLancamentoComponent,
    EditarUsuarioComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MessagesModule,
    MessageModule,
    DropdownModule,
    InputMaskModule,
    CalendarModule,
    NgxMaskModule.forRoot(maskConfig),
    BlockUIModule,
    ProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

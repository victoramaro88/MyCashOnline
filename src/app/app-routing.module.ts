import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './Paginas/login/login.component';
import { UsuarioComponent } from './Paginas/Cadastros/usuario/usuario.component';
import { MasterComponent } from './Paginas/Layout/master/master.component';
import { HomeComponent } from './Paginas/home/home.component';
import { CadCartaoComponent } from './Paginas/Cadastros/cad-cartao/cad-cartao.component';
import { NovoLancamentoComponent } from './Paginas/novo-lancamento/novo-lancamento.component';
import { EditarUsuarioComponent } from './Paginas/Cadastros/editar-usuario/editar-usuario.component';
import { IntFinUsrComponent } from './Paginas/Cadastros/int-fin-usr/int-fin-usr.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'master',
  component: MasterComponent,
  children: [
    { path: 'home', component: HomeComponent },
    { path: 'cadCartao', component: CadCartaoComponent },
    { path: 'instFinUsr', component: IntFinUsrComponent },
    { path: 'novoLancamento', component: NovoLancamentoComponent },
    { path: 'editarUsuario', component: EditarUsuarioComponent }
  ],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

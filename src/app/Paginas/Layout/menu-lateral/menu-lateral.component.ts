import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  faFolderPlus = faFolderPlus;

  // ->Variáveis para ativar ou não os links.
  menuDashboard: boolean = true;
  menuCadastro: boolean = false;
  menuServicos: boolean = false;

  items: MenuItem[];

  constructor() { }

  ngOnInit(): void {

  }

  LimpaMenusAtivos() {
    this.menuDashboard = false;
    this.menuCadastro = false;
  }

  AtivaMenu(menu: string) {
    this.LimpaMenusAtivos();
    switch (menu) {
      case 'Dashboard':
      this.menuDashboard = true;
      this.menuCadastro = false;
      this.menuServicos = false;
      break;
      case 'Cadastro':
      this.menuCadastro = true;
      this.menuDashboard = false;
      this.menuServicos = false;
      break;
      case 'Servicos':
      this.menuServicos = true;
      this.menuCadastro = false;
      this.menuDashboard = false;
      break;

      default:
      break;
    }
  }

}

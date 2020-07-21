import { Component, OnInit } from '@angular/core';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Message } from 'primeng/api/message';
import { InstFinUsrCompletaModel } from 'src/app/Models/instFin/instFinUsrCompleta.model';

@Component({
  selector: 'app-int-fin-usr',
  templateUrl: './int-fin-usr.component.html',
  styleUrls: ['./int-fin-usr.component.css']
})
export class IntFinUsrComponent implements OnInit {
  msgs: Message[] = [];
  spinnerBlock = false;
  instituicoesUsuario: InstFinUsrCompletaModel[] = [];

  constructor(
    private http: RequisicoesHttpService,
    ) { }

    ngOnInit(): void {
      this.ListarInstFinUsuario();
    }

    ListarInstFinUsuario() {
      this.spinnerBlock = true;
      this.http.ListarInsFinUsrByIdUsr(sessionStorage.getItem('idUsuario')).subscribe((ret: InstFinUsrCompletaModel[]) => {
        if (ret.length > 0) {
          this.instituicoesUsuario = ret;
          console.log(this.instituicoesUsuario);
        }
        this.spinnerBlock = false;
      }, err => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Erro: ', detail: err.message + '. Contate o administrador.'});
        scrollTo(0, 0);
        this.spinnerBlock = false;
      });
    }

    AlteraStatusInstFinUsr(idIFU: number, statusNovo: boolean) {
      this.spinnerBlock = true;
      this.http.AlteraStatusInstFinUsr(idIFU, statusNovo).subscribe((ret: string) => {
        if (ret === 'OK') {
          console.log('Alterado com Sucesso!');

          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < this.instituicoesUsuario.length; index++) {
            if(this.instituicoesUsuario[index].ifuCodi === idIFU) {
              this.instituicoesUsuario[index].ifuFlAt = statusNovo;
            }
          }

          scrollTo(0, 0);
          this.msgs = [];
          this.msgs.push({
            severity: 'success',
            summary: 'Sucesso! ',
            detail: 'Instituição Financeira ' + (statusNovo ? 'Ativada' : 'Desativada') + ' com sucesso!'
          });

          setTimeout(() => {
            this.msgs = [];
          }, 3000);

        } else {
          console.log('Erro: ' + ret);
        }
        this.spinnerBlock = false;
      }, err => {
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Erro: ', detail: err.message + '. Contate o administrador.'});
        scrollTo(0, 0);
        this.spinnerBlock = false;
      });
    }
  }

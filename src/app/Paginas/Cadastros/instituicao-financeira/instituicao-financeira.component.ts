import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api/message';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Router } from '@angular/router';
import { InstituicaoFinanceiraModel } from 'src/app/Models/instFin/instituicaoFinanceira.model';

@Component({
  selector: 'app-instituicao-financeira',
  templateUrl: './instituicao-financeira.component.html',
  styleUrls: ['./instituicao-financeira.component.css']
})
export class InstituicaoFinanceiraComponent implements OnInit {
  instituicoesFinanceiras: InstituicaoFinanceiraModel[] = [];
  msgs: Message[] = [];
  spinnerBlock = false;
  formCadastro: FormGroup;
  submitted = false;
  manterRegistro = false;

  constructor(
    private http: RequisicoesHttpService,
    private formBuilder: FormBuilder,
    private routes: Router,
    ) { }

    ngOnInit(): void {
      this.ListarInstituicoesFinanceiras(0);
    }

    ListarInstituicoesFinanceiras(idInstFin: number) {
      this.spinnerBlock = true;
      this.http.ListarInstituicaoFinanceira(idInstFin).subscribe((ret: InstituicaoFinanceiraModel[]) => {
        if (ret.length > 0) {
          this.instituicoesFinanceiras = ret;
          this.AbrirJanelaManter(idInstFin);
          // console.log(this.instituicoesFinanceiras);
        }
        this.spinnerBlock = false;
      }, err => {
        if (err.status === 401) {
          this.routes.navigate(['/login']);
        }
        this.msgs = [];
        this.msgs.push({severity: 'error', summary: 'Erro: ', detail: err.message + '. Contate o administrador.'});
        scrollTo(0, 0);
        this.spinnerBlock = false;
      });
    }

    AbrirJanelaManter(idInstFin: number) {
      if (idInstFin > 0) {
        this.manterRegistro = true;
        // tslint:disable-next-line: prefer-for-of
        // for (let i = 0; i < this.instituicoesUsuario.length; i++) {
        //   if (this.instituicoesUsuario[i].ifuCodi === idInstFinUsr) {
        //     this.instFinUsrEdit.ifuCodi = this.instituicoesUsuario[i].ifuCodi;
        //     this.instFinUsrEdit.ifuFlAt = this.instituicoesUsuario[i].ifuFlAt;
        //     this.f.ifCodi.setValue(this.instituicoesUsuario[i].ifCodi);
        //     this.f.ifuNAgen.setValue(this.instituicoesUsuario[i].ifuNAgen);
        //     this.f.ifuNConta.setValue(this.instituicoesUsuario[i].ifuNConta);
        //     this.ConverteValor(this.instituicoesUsuario[i].ifuLimit.toString(), 'Limite', false);
        //     this.ConverteValor(this.instituicoesUsuario[i].ifuSaldo.toString(), 'Saldo', false);
        //   }
        // }
      }
    }

    AlteraStatusInstFinanc(idInstFin: number, statusNovo: boolean) {
      this.spinnerBlock = true;
      this.http.AlteraStatusInstFinanc(idInstFin, statusNovo).subscribe((ret: string) => {
        if (ret === 'OK') {
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < this.instituicoesFinanceiras.length; index++) {
            if(this.instituicoesFinanceiras[index].ifCodi === idInstFin) {
              this.instituicoesFinanceiras[index].ifFlAt = statusNovo;
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

    CancelaOperacao() {
      // this.IniciaValidacaoForm();
      this.manterRegistro = false;
    }
  }

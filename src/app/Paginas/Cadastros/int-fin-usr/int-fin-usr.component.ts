import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Message } from 'primeng/api/message';
import { InstFinUsrCompletaModel } from 'src/app/Models/instFin/instFinUsrCompleta.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InstituicaoFinanceiraModel } from 'src/app/Models/instFin/instituicaoFinanceira.model';
import { InstitFinancUsuarioModel } from 'src/app/Models/instFin/instFinanUsuario.model';

@Component({
  selector: 'app-int-fin-usr',
  templateUrl: './int-fin-usr.component.html',
  styleUrls: ['./int-fin-usr.component.css']
})
export class IntFinUsrComponent implements OnInit {
  msgs: Message[] = [];
  spinnerBlock = false;
  instituicoesUsuario: InstFinUsrCompletaModel[] = [];
  instituicoesFinanceiras: InstituicaoFinanceiraModel[] = [];
  instFinUsrEdit: InstitFinancUsuarioModel = new InstitFinancUsuarioModel();
  formCadastro: FormGroup;
  submitted = false;
  manterRegistro = false;

  constructor(
    private http: RequisicoesHttpService,
    private formBuilder: FormBuilder,
    private routes: Router,
    ) { }

    ngOnInit(): void {
      this.ListarInstFinUsuario();
      this.IniciaValidacaoForm();
    }

    get f() { return this.formCadastro.controls; }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        ifCodi: ['', Validators.required],
        ifuNAgen: [''],
        ifuNConta: [''],
        ifuLimit: [''],
        ifuSaldo: ['', Validators.required]
      });
    }

    ListarInstituicoesFinanceiras() {
      this.spinnerBlock = true;
      this.http.ListarInstituicaoFinanceira().subscribe((ret: InstituicaoFinanceiraModel[]) => {
        if (ret.length > 0) {
          this.instituicoesFinanceiras = ret;
          console.log(this.instituicoesFinanceiras);
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

    ListarInstFinUsuario() {
      this.spinnerBlock = true;
      this.http.ListarInsFinUsrByIdUsr(sessionStorage.getItem('idUsuario')).subscribe((ret: InstFinUsrCompletaModel[]) => {
        if (ret.length > 0) {
          this.instituicoesUsuario = ret;
          // console.log(this.instituicoesUsuario);
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

    AlteraStatusInstFinUsr(idIFU: number, statusNovo: boolean) {
      this.spinnerBlock = true;
      this.http.AlteraStatusInstFinUsr(idIFU, statusNovo).subscribe((ret: string) => {
        if (ret === 'OK') {
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

    AbrirJanelaManter(idInstFinUsr: number) {
      console.log('ID Selecionado: ' + idInstFinUsr);
      this.ListarInstituicoesFinanceiras();
      this.manterRegistro = true;

      // ->CRIAR ROTINA PARA PESQUISAR A INSTITUIÇÃO DO USUÁRIO SELECIONADA CASO SEJA EDIÇÃO.
      if (idInstFinUsr > 0) {
        console.log('EDIÇÃO');
      }
    }

    CancelaOperacao() {
      this.IniciaValidacaoForm();
      this.manterRegistro = false;
    }

    ManterRegistro() {
      // this.spinnerBlock = true;
      this.submitted = true;
      if (this.formCadastro.invalid) {
        return;
      }
      const instFinancUsuarioModel: InstitFinancUsuarioModel = new InstitFinancUsuarioModel();

      instFinancUsuarioModel.ifuCodi = this.instFinUsrEdit.ifuCodi !== undefined ? this.instFinUsrEdit.ifuCodi : 0;
      instFinancUsuarioModel.ifCodi = this.f.ifCodi.value;
      instFinancUsuarioModel.usuCodi = +sessionStorage.getItem('idUsuario');
      instFinancUsuarioModel.ifuNAgen = this.f.ifuNAgen.value;
      instFinancUsuarioModel.ifuNConta = this.f.ifuNConta.value;
      instFinancUsuarioModel.ifuLimit = this.f.ifuLimit.value;
      instFinancUsuarioModel.ifuSaldo = this.f.ifuSaldo.value;
      instFinancUsuarioModel.ifuFlAt = this.instFinUsrEdit.ifuFlAt !== undefined ? this.instFinUsrEdit.ifuFlAt : true;

      console.log(instFinancUsuarioModel);

      // this.http.ManterInstitFinancUsr(instFinancUsuarioModel).subscribe((ret: string) => {
      //   if (ret.length > 0) {
      //     console.log(ret);
      //     if (ret !== undefined && ret === 'OK') {
      //       this.msgs = [];
      //       this.msgs.push({severity: 'success', summary: 'Dados atualizados com Sucesso!', detail: ''});
      //       scrollTo(0, 0);
      //       setTimeout(() => {
      //         this.msgs = [];
      //       }, 3000);
      //     } else {
      //       this.msgs = [];
      //       this.msgs.push({severity: 'error', summary: 'Erro: ', detail: ret});
      //       scrollTo(0, 0);
      //     }
      //   }
      //   this.spinnerBlock = false;
      // }, err => {
      //   if (err.status === 401) {
      //     this.routes.navigate(['/login']);
      //   }
      //   this.msgs = [];
      //   this.msgs.push({severity: 'error', summary: 'Erro: ', detail: err.message + '. Contate o administrador.'});
      //   scrollTo(0, 0);
      //   this.spinnerBlock = false;
      // });
    }

    // ->CORRIGIR ESSE ERRO!
    CalculaMonetario(valor: any) {
      try {
        console.log(valor);
        switch (valor.length) {
          case 1:
            valor = '0.0' + valor;
            break;
            case 5:
            valor = valor * 10;
            break;

          default:
            break;
        }

        this.f.ifuLimit.setValue(valor);

      } catch (error) {
        console.log('Valor Inválido');
      }
    }
  }

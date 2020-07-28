import { Utilitarios } from './../../../Services/utilitarios';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Message } from 'primeng/api/message';
import { InstFinUsrCompletaModel } from 'src/app/Models/instFin/instFinUsrCompleta.model';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { InstituicaoFinanceiraModel } from 'src/app/Models/instFin/instituicaoFinanceira.model';
import { InstitFinancUsuarioModel } from 'src/app/Models/instFin/instFinanUsuario.model';
import { ContatoEmailModel } from '../../Comuns/envia-email/cttEmail.model';

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
  mostrarModalAvisoBool = false; // ->Modal para aviso de Inst Fin Inativa

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

    mostrarModalAviso() {
      this.mostrarModalAvisoBool = true;
  }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        ifCodi: ['', Validators.required],
        ifuNAgen: [''],
        ifuNConta: [''],
        ifuLimit: [''],
        ifuSaldo: ['', Validators.required]
      });
    }

    ListarInstituicaoFinanceiraAtiva(idUsuario: number) {
      this.spinnerBlock = true;
      this.http.ListarInstituicaoFinanceiraAtiva().subscribe((ret: InstituicaoFinanceiraModel[]) => {
        if (ret.length > 0) {
          this.instituicoesFinanceiras = ret;
          this.AbrirJanelaManter(idUsuario);
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
      this.manterRegistro = true;
      if (idInstFinUsr > 0) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.instituicoesUsuario.length; i++) {
          if (this.instituicoesUsuario[i].ifuCodi === idInstFinUsr) {
            this.instFinUsrEdit.ifuCodi = this.instituicoesUsuario[i].ifuCodi;
            this.instFinUsrEdit.ifuFlAt = this.instituicoesUsuario[i].ifuFlAt;
            this.f.ifCodi.setValue(this.instituicoesUsuario[i].ifFlAt ? this.instituicoesUsuario[i].ifCodi : '');
            this.f.ifuNAgen.setValue(this.instituicoesUsuario[i].ifuNAgen);
            this.f.ifuNConta.setValue(this.instituicoesUsuario[i].ifuNConta);
            this.ConverteValor(this.instituicoesUsuario[i].ifuLimit.toString(), 'Limite', false);
            this.ConverteValor(this.instituicoesUsuario[i].ifuSaldo.toString(), 'Saldo', false);
          }
        }
      }
    }

    CancelaOperacao() {
      this.ListarInstFinUsuario();
      this.IniciaValidacaoForm();
      this.manterRegistro = false;
    }

    ManterRegistro() {
      this.submitted = true;
      if (this.formCadastro.invalid) {
        return;
      }

      this.spinnerBlock = true;
      const instFinancUsuarioModel: InstitFinancUsuarioModel = new InstitFinancUsuarioModel();

      instFinancUsuarioModel.ifuCodi = this.instFinUsrEdit.ifuCodi !== undefined ? this.instFinUsrEdit.ifuCodi : 0;
      instFinancUsuarioModel.ifCodi = this.f.ifCodi.value;
      instFinancUsuarioModel.usuCodi = +sessionStorage.getItem('idUsuario');
      instFinancUsuarioModel.ifuNAgen = this.f.ifuNAgen.value;
      instFinancUsuarioModel.ifuNConta = this.f.ifuNConta.value;
      instFinancUsuarioModel.ifuLimit = +this.f.ifuLimit.value;
      instFinancUsuarioModel.ifuSaldo = +this.f.ifuSaldo.value;
      instFinancUsuarioModel.ifuFlAt = this.instFinUsrEdit.ifuFlAt !== undefined ? this.instFinUsrEdit.ifuFlAt : true;

      this.http.ManterInstitFinancUsr(instFinancUsuarioModel).subscribe((ret: string) => {
        if (ret.length > 0) {
          if (ret !== undefined && ret === 'OK') {
            this.msgs = [];
            this.msgs.push({severity: 'success', summary: 'Dados ' + (instFinancUsuarioModel.ifuCodi > 0 ? 'atualizados' : 'inseridos') + ' com Sucesso!', detail: ''});
            scrollTo(0, 0);
            setTimeout(() => {
              this.msgs = [];
              this.CancelaOperacao();
            }, 3000);
          } else {
            this.msgs = [];
            this.msgs.push({severity: 'error', summary: 'Erro: ', detail: ret});
            scrollTo(0, 0);
          }
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

    ConverteValor(valor: string, input: string, insercao: boolean) {
      if (input === 'Limite') {
        const ret = Utilitarios.CalculaMonetario(valor, insercao);
        if (ret !== 'Número Inválido') {
          this.f.ifuLimit.setValue(ret);
        } else {
          this.f.ifuLimit.setValue('0');
          console.log(ret);
        }
      } else if (input === 'Saldo') {
        const ret = Utilitarios.CalculaMonetario(valor, insercao);
        if (ret !== 'Número Inválido') {
          this.f.ifuSaldo.setValue(ret);
        } else {
          this.f.ifuSaldo.setValue('0');
          console.log(ret);
        }
      }
    }

    EnviaEmail() {
      ContatoEmailModel.remetente = sessionStorage.getItem('emailUsuario');
      ContatoEmailModel.destinatario = 'contatomycash@gmail.com';
      ContatoEmailModel.assunto = 'Instituição Financeira inativa no sistema';
      ContatoEmailModel.mensagem = '';
    }
  }

import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Router } from '@angular/router';
import { InstituicaoFinanceiraModel } from 'src/app/Models/instFin/instituicaoFinanceira.model';
import { Utilitarios } from 'src/app/Services/utilitarios';

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
  manterRegistro = true;

  uploadedFiles: any[] = [];

  constructor(
    private http: RequisicoesHttpService,
    private formBuilder: FormBuilder,
    private routes: Router,
    ) { }

    ngOnInit(): void {
      this.IniciaValidacaoForm();

      this.ListarInstituicoesFinanceiras(0);
    }

    get f() { return this.formCadastro.controls; }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        ifCodi: ['', Validators.required],
        ifDesc: ['', Validators.required],
        ifCod: [''],
        // ifImg: [''],
        // ifFlAt: ['', Validators.required]
      });
    }

    ManterInstituicaoFinanceira(idInstFin: number) {
      this.spinnerBlock = true;
      if (idInstFin > 0) {
        this.http.ListarInstituicaoFinanceira(idInstFin).subscribe((ret: InstituicaoFinanceiraModel[]) => {
          if (ret.length > 0) {
            this.instituicoesFinanceiras = ret;
            this.AbrirJanelaManter(idInstFin);
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
      } else {
        this.AbrirJanelaManter(idInstFin);
        this.spinnerBlock = false;
      }

    }

    ListarInstituicoesFinanceiras(idInstFin: number) {
      this.spinnerBlock = true;
      this.http.ListarInstituicaoFinanceira(idInstFin).subscribe((ret: InstituicaoFinanceiraModel[]) => {
        if (ret.length > 0) {
          console.log(ret);
          this.instituicoesFinanceiras = ret;
          this.AbrirJanelaManter(idInstFin);
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

    onUpload(event) {
      for (let file of event.files) {
        this.uploadedFiles.push(file);
      }
      console.log(this.uploadedFiles);

      // this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }

    // ->Seleção de imagem.
    public imagePath;
    imgURL: any;
    public message: string;

    preview(files) {
      if (files.length === 0)
      return;

      var mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = "Somente imagens são suportadas.";
        return;
      }

      var reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
    // ->Fim da seleção de imagem.

    ManterRegistro() {
      this.submitted = true;
      if (this.formCadastro.invalid) {
        return;
      }

      this.spinnerBlock = true;
      // const instFinancUsuarioModel: InstitFinancUsuarioModel = new InstitFinancUsuarioModel();

      // instFinancUsuarioModel.ifuCodi = this.instFinUsrEdit.ifuCodi !== undefined ? this.instFinUsrEdit.ifuCodi : 0;
      // instFinancUsuarioModel.ifCodi = this.f.ifCodi.value;
      // instFinancUsuarioModel.usuCodi = +sessionStorage.getItem('idUsuario');
      // instFinancUsuarioModel.ifuNAgen = this.f.ifuNAgen.value;
      // instFinancUsuarioModel.ifuNConta = this.f.ifuNConta.value;
      // instFinancUsuarioModel.ifuLimit = +this.f.ifuLimit.value;
      // instFinancUsuarioModel.ifuSaldo = +this.f.ifuSaldo.value;
      // instFinancUsuarioModel.ifuFlAt = this.instFinUsrEdit.ifuFlAt !== undefined ? this.instFinUsrEdit.ifuFlAt : true;

      // this.http.ManterInstitFinancUsr(instFinancUsuarioModel).subscribe((ret: string) => {
      //   if (ret.length > 0) {
      //     if (ret !== undefined && ret === 'OK') {
      //       this.msgs = [];
      //       this.msgs.push({severity: 'success', summary: 'Dados ' + (instFinancUsuarioModel.ifuCodi > 0 ? 'atualizados' : 'inseridos') + ' com Sucesso!', detail: ''});
      //       scrollTo(0, 0);
      //       setTimeout(() => {
      //         this.msgs = [];
      //         this.CancelaOperacao();
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
  }

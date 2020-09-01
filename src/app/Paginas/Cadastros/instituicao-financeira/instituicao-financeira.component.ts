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
  manterRegistro = false;
  
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
        ifCodi: [''],
        ifDesc: ['', Validators.required],
        ifCod: [''],
        ifImg: ['']
      });
    }
    
    ManterInstituicaoFinanceira(idInstFin: number) {
      this.manterRegistro = true;
      // this.spinnerBlock = true;
      // if (idInstFin > 0) {
      //   this.http.ListarInstituicaoFinanceira(idInstFin).subscribe((ret: InstituicaoFinanceiraModel[]) => {
      //     if (ret.length > 0) {
      //       this.instituicoesFinanceiras = ret;
      //       this.AbrirJanelaManter(idInstFin);
      //     }
      //     this.spinnerBlock = false;
      //   }, err => {
      //     if (err.status === 401) {
      //       this.routes.navigate(['/login']);
      //     }
      //     this.msgs = [];
      //     this.msgs.push({severity: 'error', summary: 'Erro: ', detail: err.message + '. Contate o administrador.'});
      //     scrollTo(0, 0);
      //     this.spinnerBlock = false;
      //   });
      // } else {
      //   this.AbrirJanelaManter(idInstFin);
      //   this.spinnerBlock = false;
      // }
    }
    
    ListarInstituicoesFinanceiras(idInstFin: number) {
      this.spinnerBlock = true;
      this.http.ListarInstituicaoFinanceira(idInstFin).subscribe((ret: InstituicaoFinanceiraModel[]) => {
        if (ret.length > 0) {
          // console.log(ret);
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
        this.f.ifCodi.setValue(this.instituicoesFinanceiras[0].ifCodi);
        this.f.ifDesc.setValue(this.instituicoesFinanceiras[0].ifDesc);
        this.f.ifCod.setValue(this.instituicoesFinanceiras[0].ifCod);
        this.imgURL = this.instituicoesFinanceiras[0].ifImg.length > 0
        ? 'data:image/png;base64,' + this.instituicoesFinanceiras[0].ifImg
        : '../../../../assets/Imagens/NoPhoto.png';
        // console.log(this.f);
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
      this.ListarInstituicoesFinanceiras(0);
    }
    
    // ->Seleção de imagem.
    public imagePath;
    imgURL: any; //Já em base64
    public message: string;
    
    preview(files) {
      if (files.length === 0) {
        this.imgURL = null;
        return;
      }
      
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
      
      const instFinObj: InstituicaoFinanceiraModel = new InstituicaoFinanceiraModel();
      instFinObj.ifCodi = this.instituicoesFinanceiras[0].ifCodi !== undefined ? this.instituicoesFinanceiras[0].ifCodi : 0;
      instFinObj.ifDesc = this.f.ifDesc.value;
      instFinObj.ifCodi = this.f.ifCodi.value;
      instFinObj.ifImg = this.imgURL !== '../../../../assets/Imagens/NoPhoto.png' ? this.imgURL : null;
      instFinObj.ifFlAt = this.instituicoesFinanceiras[0].ifFlAt !== undefined ? this.instituicoesFinanceiras[0].ifFlAt : true;
      
      console.log(instFinObj);
      this.http.ManterInstitFinanceira(instFinObj).subscribe((ret: string) => {
        if (ret.length > 0) {
          if (ret !== undefined && ret === 'OK') {
            this.msgs = [];
            this.msgs.push({
              severity: 'success', summary: 'Dados ' + (instFinObj.ifCodi > 0 ? 'atualizados' : 'inseridos') + ' com Sucesso!', detail: ''
            });
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
  }
  
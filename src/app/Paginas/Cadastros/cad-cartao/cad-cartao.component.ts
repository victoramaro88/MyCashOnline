// tslint:disable: max-line-length
// tslint:disable: variable-name
// tslint:disable: prefer-for-of
// tslint:disable: no-trailing-whitespace
// tslint:disable: member-ordering
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api/message';
import { CartaoUsuarioModel } from 'src/app/Models/cartao/cartaoUsuario.model';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Utilitarios } from 'src/app/Services/utilitarios';

@Component({
  selector: 'app-cad-cartao',
  templateUrl: './cad-cartao.component.html',
  styleUrls: ['./cad-cartao.component.css']
})
export class CadCartaoComponent implements OnInit {
  @ViewChild('imgLogoBC') imgLogo: ElementRef;
  listaCartaoUsuario: CartaoUsuarioModel[] = [];
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

    // ->Seleção de imagem.
    public imagePath;
    imgURL: any; // ->Já em base64
    public message: string;

    preview(files) {
      if (files.length === 0) {
        this.imgURL = null;
        return;
      }

      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        this.message = 'Somente imagens são suportadas.';
        return;
      }

      const reader = new FileReader();
      this.imagePath = files;
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.loadImg();
      };
    }

    tamanhoImagem: number;
    loadImg() {
      if (this.imgLogo !== undefined) {
        const img: HTMLImageElement = this.imgLogo.nativeElement;
        this.tamanhoImagem = Utilitarios.CalculaTamanhoImagemBase64(this.imgURL);

        Utilitarios.RedimensionarImagem(this.imgURL, img.width, img.height).then(compressed => {
          this.imgURL = compressed;
        });
      }
    }
    // ->Fim da seleção de imagem.

    ngOnInit(): void {
      this.IniciaValidacaoForm();
      this.ListarCartaoByIdUsr(0);
    }

    get f() { return this.formCadastro.controls; }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        carCodi: [''],
        bcCodi: [''],
        ifCodi: [''],
        usuCodi: [''],
        carDesc: ['', Validators.required],
        carLimit: [''],
        carDiaVenc: ['', Validators.required],
        carSald: ['', Validators.required],
        carFlAt: ['']
      });
    }

    // -> ALTERAR O SERVIÇO PARA RECEBER TOKEN DE AUTORIZAÇÃO!!!
    ListarCartaoByIdUsr(idCarCodi: number) {
      this.spinnerBlock = true;
      this.http.ListarCartaoByIdUsuario(+sessionStorage.getItem('idUsuario')).subscribe((ret: CartaoUsuarioModel[]) => {
        // console.log(ret);
        if (ret.length > 0) {
          this.listaCartaoUsuario = ret;
          this.AbrirJanelaManter(idCarCodi);
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

    AbrirJanelaManter(carCodi: number) {
      for (let i = 0; i < this.listaCartaoUsuario.length; i++) {
        // console.log(carCodi);
        if (this.listaCartaoUsuario[i].carCodi === carCodi) {
          this.manterRegistro = true;
          this.f.carCodi.setValue(this.listaCartaoUsuario[i].carCodi);
          this.f.bcCodi.setValue(this.listaCartaoUsuario[i].bcCodi);
          this.f.ifCodi.setValue(this.listaCartaoUsuario[i].ifCodi);
          this.f.usuCodi.setValue(this.listaCartaoUsuario[i].usuCodi);
          this.f.carDesc.setValue(this.listaCartaoUsuario[i].carDesc);
          this.f.carLimit.setValue(this.listaCartaoUsuario[i].carLimit);
          this.f.carDiaVenc.setValue(this.listaCartaoUsuario[i].carDiaVenc);
          this.f.carSald.setValue(this.listaCartaoUsuario[i].carSald);
          this.f.carFlAt.setValue(this.listaCartaoUsuario[i].carFlAt);
          console.log('Listando:');
          console.log(this.f);
        }
      }
    }

    CancelaOperacao() {
      this.IniciaValidacaoForm();
      this.manterRegistro = false;
      this.imgURL = '';
      this.ListarCartaoByIdUsr(0);
    }

    CadastrarBandeiraCartao() {
      this.manterRegistro = true;
      this.IniciaValidacaoForm();
      this.listaCartaoUsuario = new Array<CartaoUsuarioModel>();
    }

    // -> IMPLEMENTAR AINDA!!!
    AlteraStatusCartUsr(carCodi: number, novoStatus: boolean) {
      console.log('carCodi: ' + carCodi + ' / novoStatus: ' + novoStatus);
    }

  }

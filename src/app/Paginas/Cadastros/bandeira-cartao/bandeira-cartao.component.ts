// tslint:disable: variable-name
// tslint:disable: prefer-for-of
// tslint:disable: no-trailing-whitespace
// tslint:disable: member-ordering
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from 'primeng/api/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Router } from '@angular/router';
import { BandeiraCartaoModel } from 'src/app/Models/cartao/bandeiraCartao.model';
import { Utilitarios } from 'src/app/Services/utilitarios';

@Component({
  selector: 'app-bandeira-cartao',
  templateUrl: './bandeira-cartao.component.html',
  styleUrls: ['./bandeira-cartao.component.css']
})
export class BandeiraCartaoComponent implements OnInit {
  @ViewChild('imgLogo') imgLogo: ElementRef;
  listaBandeiraCartao: BandeiraCartaoModel[] = [];
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
      const img: HTMLImageElement = this.imgLogo.nativeElement;
      this.tamanhoImagem = Utilitarios.CalculaTamanhoImagemBase64(this.imgURL);

      Utilitarios.RedimensionarImagem(this.imgURL, img.width, img.height).then(compressed => {
        this.imgURL = compressed;
      });
    }
    // ->Fim da seleção de imagem.

  ngOnInit(): void {
    this.IniciaValidacaoForm();
    this.ListarBandeiraCartao(0);
  }

  get f() { return this.formCadastro.controls; }

  IniciaValidacaoForm() {
    this.formCadastro = this.formBuilder.group({
      bcCodi: [''],
      bcDesc: ['', Validators.required],
      ifImg: [''],
      bcFlAt: ['']
    });
  }

  ManterBandeiraCartao() {
    this.manterRegistro = true;
    this.IniciaValidacaoForm();
    this.listaBandeiraCartao = new Array<BandeiraCartaoModel>();
  }

  ListarBandeiraCartao(idBandCart: number) {
    this.spinnerBlock = true;
    this.http.ListarBandeiraCartao(idBandCart).subscribe((ret: BandeiraCartaoModel[]) => {
      if (ret.length > 0) {
        console.log(ret);
        this.listaBandeiraCartao = ret;
        this.AbrirJanelaManter(idBandCart);
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
      this.f.bcCodi.setValue(this.listaBandeiraCartao[0].bcCodi);
      this.f.bcDesc.setValue(this.listaBandeiraCartao[0].bcDesc);
      this.imgURL = this.listaBandeiraCartao[0].bcImg.length > 0
      ? 'data:image/png;base64,' + this.listaBandeiraCartao[0].bcImg
      : '../../../../assets/Imagens/NoPhoto.png';
      this.f.bcFlAt.setValue(this.listaBandeiraCartao[0].bcFlAt);
      // console.log(this.f);
    }
  }
}

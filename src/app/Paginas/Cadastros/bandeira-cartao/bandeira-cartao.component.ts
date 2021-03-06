// tslint:disable: max-line-length
// tslint:disable: variable-name
// tslint:disable: prefer-for-of
// tslint:disable: no-trailing-whitespace
// tslint:disable: member-ordering
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('imgLogoBC') imgLogo: ElementRef;
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

    CancelaOperacao() {
      this.IniciaValidacaoForm();
      this.manterRegistro = false;
      this.imgURL = '';
      this.ListarBandeiraCartao(0);
    }

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
      this.ListarBandeiraCartao(0);
    }

    get f() { return this.formCadastro.controls; }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        bcCodi: [''],
        bcDesc: ['', Validators.required],
        bcImg: [''],
        bcFlAt: ['']
      });
    }

    CadastrarBandeiraCartao() {
      this.manterRegistro = true;
      this.IniciaValidacaoForm();
      this.listaBandeiraCartao = new Array<BandeiraCartaoModel>();
    }

    ListarBandeiraCartao(idBandCart: number) {
      this.spinnerBlock = true;
      this.http.ListarBandeiraCartao(idBandCart).subscribe((ret: BandeiraCartaoModel[]) => {
        if (ret.length > 0) {
          // console.log(ret);
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

    AlteraStatusBandCart(idBandCart: number, statusNovo: boolean) {
      this.spinnerBlock = true;
      this.http.AlteraStatusBandeiraCartao(idBandCart, statusNovo).subscribe((ret: string) => {
        if (ret === 'OK') {
          for (let index = 0; index < this.listaBandeiraCartao.length; index++) {
            if (this.listaBandeiraCartao[index].bcCodi === idBandCart) {
              this.listaBandeiraCartao[index].bcFlAt = statusNovo;
            }
          }

          scrollTo(0, 0);
          this.msgs = [];
          this.msgs.push({
            severity: 'success',
            summary: 'Sucesso! ',
            detail: 'Bandeira de Cartão ' + (statusNovo ? 'Ativada' : 'Desativada') + ' com sucesso!'
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

    ManterRegistro() {
      this.submitted = true;
      if (this.formCadastro.invalid || this.tamanhoImagem > 50) {
        return;
      }

      this.spinnerBlock = true;

      const bandCartObj: BandeiraCartaoModel = new BandeiraCartaoModel();
      bandCartObj.bcCodi = this.listaBandeiraCartao.length > 0 ? this.listaBandeiraCartao[0].bcCodi : 0;
      bandCartObj.bcDesc = this.f.bcDesc.value;
      bandCartObj.bcImg = (this.imgURL !== undefined && this.imgURL !== '../../../../assets/Imagens/NoPhoto.png') ? this.imgURL : '';
      bandCartObj.bcFlAt = this.listaBandeiraCartao.length > 0 ? this.listaBandeiraCartao[0].bcFlAt : true;

      // console.log(bandCartObj);

      this.http.ManterBandeiraCartao(bandCartObj).subscribe((ret: string) => {
        // console.log(ret);
        if (ret.length > 0) {
          if (ret !== undefined && ret === 'OK') {
            this.msgs = [];
            this.msgs.push({
              severity: 'success', summary: 'Dados ' + (bandCartObj.bcCodi > 0 ? 'atualizados' : 'inseridos') + ' com Sucesso!', detail: ''
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

// Reactive Forms: https://jasonwatmore.com/post/2019/06/14/angular-8-reactive-forms-validation-example
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Validacoes } from 'src/app/Services/validacoes';
import { ComparaSenha } from 'src/app/Services/comparaSenha';
import { Message } from 'primeng/api/message';
import { EnderecoModel } from 'src/app/Models/usuarios/endereco.model';
import { DadosUsuarioModel } from 'src/app/Models/usuarios/dadosusuario.model';
import { UsuarioModel } from 'src/app/Models/usuarios/usuario.model';
import { PerfilUsuarioModel } from 'src/app/Models/usuarios/perfilusuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  @ViewChild('inputNumLogr', {static: false}) inputNumLogr: ElementRef;
  @ViewChild('inputLogradouro', {static: false}) inputLogradouro: ElementRef;

  formCadastro: FormGroup;
  submitted = false;
  usuarioModel: UsuarioModel = new UsuarioModel();
  enderecoModel: EnderecoModel = new EnderecoModel();
  perfilUsuarioModel: PerfilUsuarioModel = new PerfilUsuarioModel();
  dadosUsuarioModel: DadosUsuarioModel = new DadosUsuarioModel();
  msgs: Message[] = [];
  emailJaCadastrado: boolean = false;
  cpfJaCadastrado: boolean = false;
  spinnerBlock: boolean = false;
  sucessoCadastro: boolean = false;
  falhaCadastro: boolean = false;
  travaBotoes: boolean = false;
  mensagemErro: string = '';
  estados = [
    {value: 'AC'},
    {value: 'AL'},
    {value: 'AP'},
    {value: 'AM'},
    {value: 'BA'},
    {value: 'CE'},
    {value: 'DF'},
    {value: 'ES'},
    {value: 'GO'},
    {value: 'MA'},
    {value: 'MT'},
    {value: 'MS'},
    {value: 'MG'},
    {value: 'PA'},
    {value: 'PB'},
    {value: 'PR'},
    {value: 'PE'},
    {value: 'PI'},
    {value: 'RJ'},
    {value: 'RN'},
    {value: 'RS'},
    {value: 'RO'},
    {value: 'RR'},
    {value: 'SC'},
    {value: 'SP'},
    {value: 'SE'},
    {value: 'TO'}
  ];

  constructor(
    private http: RequisicoesHttpService,
    private formBuilder: FormBuilder, ) { }

    ngOnInit(): void {
      this.IniciaValidacaoForm();
    }

    get f() { return this.formCadastro.controls; }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        usuNome: ['', Validators.required],
        usuNCPF: ['', [Validators.required, Validacoes.ValidaCpf]],
        usuNasc: ['', Validators.required],
        usuEmail: ['', [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)]],
        usuSexo: ['', Validators.required],
        usuSenha: ['', [Validators.required, Validators.minLength(6)]],
        usuConfirmaSenha: ['', Validators.required],
        endNCEP: ['', Validators.required],
        endLogr: ['', Validators.required],
        endNume: ['', Validators.required],
        endCompl: [],
        endBairr: ['', Validators.required],
        endCidad: ['', Validators.required],
        endEsta: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
        usuCttEma: [false],
      }, {
        validator: ComparaSenha('usuSenha', 'usuConfirmaSenha')
      });
    }

    ValidaEnderecoPesquisado(valor: boolean) {
      if (valor) {
        this.formCadastro.controls.endLogr.disable();
        this.formCadastro.controls.endBairr.disable();
        this.formCadastro.controls.endCidad.disable();
        this.formCadastro.controls.endEsta.disable();
      } else {
        this.formCadastro.controls.endLogr.enable();
        this.formCadastro.controls.endBairr.enable();
        this.formCadastro.controls.endCidad.enable();
        this.formCadastro.controls.endEsta.enable();
      }
    }

    LimpaEndereco() {
      this.f.endLogr.setValue('');
      this.f.endBairr.setValue('');
      this.f.endCidad.setValue('');
      this.f.endEsta.setValue('');
    }

    BuscaCEP(vCEP: string) {
      this.LimpaEndereco();
      if (vCEP !== undefined && vCEP.length === 8) {
        this.http.BuscaCEP(vCEP).subscribe((ret: any) => {
          if (!ret.erro) {
            this.f.endLogr.setValue(ret.logradouro);
            this.f.endBairr.setValue(ret.bairro);
            this.f.endCidad.setValue(ret.localidade);
            this.f.endEsta.setValue(this.estados.find(estado => estado.value === ret.uf).value);
            this.inputNumLogr.nativeElement.focus();
            this.ValidaEnderecoPesquisado(true);
          } else {
            this.ValidaEnderecoPesquisado(false);
            this.inputLogradouro.nativeElement.focus();
          }
        }, error => {
          console.log(error.message);
          // this.EmiteMensagem('error', 'Erro: ' , 'Erro ao carregar o usuário: ' + error.message, 5000);
        });
      } else {
        // alert('CEP Inválido!');
        console.log('CEP Inválido!');
        this.ValidaEnderecoPesquisado(false);
      }
    }

    ConsultaUsuarioByEmailCPF(emailCPFUsuario: string) {
      if(emailCPFUsuario.length > 0) {
        if(emailCPFUsuario.indexOf('@') >= 0) {
          this.http.ConsultaUsuarioByEmailCPF(emailCPFUsuario)
          .subscribe((ret: boolean) => {
            this.emailJaCadastrado = ret;
          },(err)=> {
            this.msgs = [];
            this.msgs.push({severity:'error', summary:'Erro: ', detail: err.message});
          });
        } else {
          this.http.ConsultaUsuarioByEmailCPF(emailCPFUsuario)
          .subscribe((ret: boolean) => {
            this.cpfJaCadastrado = ret;
          },(err)=> {
            this.msgs = [];
            this.msgs.push({severity:'error', summary:'Erro: ', detail: err.message});
          });
        }
      }
    }

    FechaJanelaErro() {
      this.falhaCadastro = false;
      this.travaBotoes = false;
    }

    SalvarNovoRegistro() {
      this.submitted = true;
      if (this.formCadastro.invalid) {
        return;
      }
      if(this.cpfJaCadastrado || this.emailJaCadastrado) {return}
      this.spinnerBlock = true;

      // ->Dados do Usuário
      this.usuarioModel.usuCodi = 0;
      this.usuarioModel.usuNome = this.f.usuNome.value;
      this.usuarioModel.usuNCPF = this.f.usuNCPF.value;
      this.usuarioModel.usuNasc = this.f.usuNasc.value;
      this.usuarioModel.usuEmail = this.f.usuEmail.value;
      this.usuarioModel.usuSenha  = this.f.usuSenha.value;
      this.usuarioModel.usuDtCad  = new Date();
      this.usuarioModel.usuFlAt  = true;
      this.usuarioModel.usuValido  = false;
      this.usuarioModel.usuSexo  = this.f.usuSexo.value;
      this.usuarioModel.usuCttEma  = this.f.usuCttEma.value;

      // ->Dados do Endereço
      this.enderecoModel.endCodi = 0;
      this.enderecoModel.usuCodi = 0;
      this.enderecoModel.endNCEP = this.f.endNCEP.value;
      this.enderecoModel.endLogr = this.f.endLogr.value;
      this.enderecoModel.endNume = this.f.endNume.value;
      this.enderecoModel.endCompl = this.f.endCompl.value;
      this.enderecoModel.endBairr = this.f.endBairr.value;
      this.enderecoModel.endCidad = this.f.endCidad.value;
      this.enderecoModel.endEsta = this.f.endEsta.value;

      // ->Dados do Perfil do Usuário
      this.perfilUsuarioModel.perCodi = 2; // ->O cadastro será sempre 2 (Usuário Sistema).
      this.perfilUsuarioModel.usuCodi = 0;

      // ->Preenchendo as informações para a Model Principal
      this.dadosUsuarioModel.usuarioModel = this.usuarioModel;
      this.dadosUsuarioModel.enderecoModel = this.enderecoModel;
      this.dadosUsuarioModel.perfilUsuarioModel = this.perfilUsuarioModel;

      // console.log(this.dadosUsuarioModel);

      this.http.ManterUsuario(this.dadosUsuarioModel).subscribe((ret: string) => {
        if(ret != undefined) {
          this.travaBotoes = true;
          this.spinnerBlock = false;
          this.sucessoCadastro = true;
        }
      },(err)=> {
        this.mensagemErro = '';
        this.mensagemErro = err.error;
        this.spinnerBlock = false;
        this.falhaCadastro = true;
        this.travaBotoes = true;
      });
    }
  }

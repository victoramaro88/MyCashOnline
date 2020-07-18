import { RequisicoesHttpService } from './../../Services/requisicoes-http.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { Login } from 'src/app/Models/login/login.model';
import { Router } from '@angular/router';
import { Message } from 'primeng/api/message';
import { InformacoesUsuarioModel } from 'src/app/Models/usuarios/informacoesUsuario.model';
import { DadosUsuEmailModel } from 'src/app/Models/usuarios/dadosusuemail.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  faUser = faUser;
  faKey = faKey;
  submitted = false;
  @ViewChild('loginForm') loginForm;
  msgs: Message[] = [];
  spinnerBlock = false;
  divReenvioEmail = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpRequisicao: RequisicoesHttpService,
    ) { }

    ngOnInit() {
      this.formLogin = this.formBuilder.group({
        usuEmai: ['', [
          Validators.required,
          Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)
        ]],
        usuSenh: ['', [
          Validators.required,
          Validators.minLength(6),
        ]
      ]
    });
  }

  get f() { return this.formLogin.controls; }

  ReenviaEmail() {
    this.spinnerBlock = true;
    this.httpRequisicao.ReenviaEmail(this.formLogin.value.usuEmai)
    .subscribe((ret: any) => {
      if(ret != undefined && ret === 'OK') {
        this.divReenvioEmail = false;
        this.msgs = [];
        this.msgs.push({severity:'success', summary:'Sucesso: ', detail: 'E-mail enviado com sucesso, verifique sua caixa de entrada.'});
      } else {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Falha ao enviar o e-mail. Contate o suporte.'});
      }
      this.spinnerBlock = false;
    },(err)=> {
      if(err.status === 0) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Falha ao localizar o serviço de autenticação. Contate o suporte.'});
      } else {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro: ', detail: err.message});
      }
      this.spinnerBlock = false;
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.formLogin.invalid) {
      return;
    }

    this.spinnerBlock = true;

    this.httpRequisicao.Logar(this.formLogin.value.usuEmai, this.formLogin.value.usuSenh)
    .subscribe((ret: any) => {
      if(ret != undefined) {
        // RequisicoesHttpService.token = ret.access_token;
        sessionStorage.setItem('tokenAcesso', ret.access_token);
        if(ret.access_token.length > 0) {
          this.httpRequisicao.ListarUsuarioByEmail(this.formLogin.value.usuEmai).subscribe((ret: DadosUsuEmailModel) => {

            console.log(ret);
            if (ret[0].usuValido) {
              sessionStorage.setItem('nomeUsuario', ret[0].usuNome);
              sessionStorage.setItem('idUsuario', ret[0].usuCodi);


              this.router.navigate(['/master/home']);

              this.loginForm.resetForm();
              this.submitted = false;
              this.spinnerBlock = false;
            } else {
              this.msgs = [];
              this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Seu cadastro não foi validado, verifique seu e-mail.'});
              this.divReenvioEmail = true;
              this.spinnerBlock = false;
            }
          },(err)=> {
            if(err.status === 401) {
              this.msgs = [];
              this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Usuário não autorizado.'});
            } else if(err.status === 0) {
              this.msgs = [];
              this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Falha ao localizar o serviço de autenticação. Contate o suporte.'});
            }
            this.spinnerBlock = false;
          });
        } else {
          this.msgs = [];
          this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Falha ao autenticar o usuário, contate o suporte.'});
        }
      }
    },(err)=> {
      if(err.status === 400) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Usuário ou senha inválidos, verifique.'});
      } else if(err.status === 0) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:'Erro: ', detail: 'Falha ao localizar o serviço de autenticação. Contate o suporte.'});
      }
      this.spinnerBlock = false;
    });
  }
}

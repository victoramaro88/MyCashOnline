import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequisicoesHttpService } from 'src/app/Services/requisicoes-http.service';
import { Router } from '@angular/router';
import { ContatoEmailModel } from './cttEmail.model';

@Component({
  selector: 'app-envia-email',
  templateUrl: './envia-email.component.html',
  styleUrls: ['./envia-email.component.css']
})
export class EnviaEmailComponent implements OnInit {
  formCadastro: FormGroup;
  submitted = false;

  constructor(
    private http: RequisicoesHttpService,
    private formBuilder: FormBuilder,
    private routes: Router,
    ) { }

    ngOnInit(): void {
      this.IniciaValidacaoForm();

      ContatoEmailModel.remetente !== undefined && ContatoEmailModel.remetente.length > 0
      ? this.f.cttRemetente.disable()
      : this.f.cttRemetente.enable();
      ContatoEmailModel.destinatario !== undefined && ContatoEmailModel.destinatario.length > 0
      ? this.f.cttDestinatario.disable()
      : this.f.cttDestinatario.enable();
      ContatoEmailModel.assunto !== undefined && ContatoEmailModel.assunto.length > 0
      ? this.f.cttAssunto.disable()
      : this.f.cttAssunto.enable();
      ContatoEmailModel.mensagem !== undefined && ContatoEmailModel.mensagem.length > 0
      ? this.f.cttMensagem.disable()
      : this.f.cttMensagem.enable();
    }

    get f() { return this.formCadastro.controls; }

    IniciaValidacaoForm() {
      this.formCadastro = this.formBuilder.group({
        cttRemetente: [ContatoEmailModel.remetente, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)]],
        cttDestinatario: [ContatoEmailModel.destinatario, [Validators.required, Validators.pattern(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,63})$/)]],
        cttAssunto: [ContatoEmailModel.assunto, Validators.required],
        cttMensagem: [ContatoEmailModel.mensagem, [Validators.required, Validators.maxLength(250), Validators.minLength(20)]],
      });
    }

    EnviaEmail() {
      this.submitted = true;
      if (this.formCadastro.invalid) {
        return;
      }

      console.log(this.formCadastro.value);
      console.log(this.f.cttRemetente.value);
    }
  }

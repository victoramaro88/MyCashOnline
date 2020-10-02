// tslint:disable: no-trailing-whitespace
// tslint:disable: max-line-length
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InformacoesUsuarioModel } from '../Models/usuarios/informacoesUsuario.model';
import { environment } from 'src/environments/environment';
import { DadosUsuarioModel } from '../Models/usuarios/dadosusuario.model';
import { DadosUsuEmailModel } from '../Models/usuarios/dadosusuemail.model';
import { InstFinUsrCompletaModel } from '../Models/instFin/instFinUsrCompleta.model';
import { InstituicaoFinanceiraModel } from '../Models/instFin/instituicaoFinanceira.model';
import { InstitFinancUsuarioModel } from '../Models/instFin/instFinanUsuario.model';
import { BandeiraCartaoModel } from '../Models/cartao/bandeiraCartao.model';

@Injectable({
  providedIn: 'root'
})
export class RequisicoesHttpService {
  // ->Variáveis de Sessão:
  // *tokenAcesso;
  // *nomeUsuario;
  // *idUsuario;
  // *emailUsuario;

  constructor(
    private http: HttpClient
    ) { }

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'X-API-KEY': ''
      })
    };

    public Logar(username: string, password: string) {
      const body = `username=${username}&password=${password}&grant_type=password`;
      return this.http.post(`${environment.BASE_URL}/token`, body);
    }

    public ListarUsuarios(idUsuario: string) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<DadosUsuarioModel>(`${environment.BASE_URL}/api/Usuario/ListarUsuarios/${idUsuario}`, header);
    }

    public ListarUsuarioByEmail(emailUsuario: string) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<DadosUsuEmailModel>(`${environment.BASE_URL}/api/Usuario/ListarUsuarioByEmail/${emailUsuario}/`, header);
    }

    public ConsultaUsuarioByEmailCPF(emailCPF: string) {
      return this.http.get<boolean>(`${environment.BASE_URL}/api/Usuario/ConsultaUsuarioByEmailCPF/${emailCPF}/`);
    }

    public ReenviaEmail(emailUsuario: string) {
      return this.http.get<string>(`${environment.BASE_URL}/api/Usuario/ReenviarEmail/${emailUsuario}/`);
    }

    public BuscaCEP(cep: string) {
      return this.http.get('http://viacep.com.br/ws/' + cep + '/json/');
    }

    public ManterUsuario(dadosUsuarioModel: DadosUsuarioModel) {
      return this.http.post<string>(`${environment.BASE_URL}/api/Usuario/ManterUsuario/`, dadosUsuarioModel);
    }

    public ListarInsFinUsrByIdUsr(idUsuario: string) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<InstFinUsrCompletaModel[]>(`${environment.BASE_URL}/api/InstFinancUsuario/ListarInsFinUsrByIdUsr/${idUsuario}/`, header);
    }

    public ListarInstituicaoFinanceira(idInstFin: number) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<InstituicaoFinanceiraModel[]>(`${environment.BASE_URL}/api/InstituicaoFinanceira/ListarInstitFinanceiras/${idInstFin}`, header);
    }

    public ListarInstituicaoFinanceiraAtiva() {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<InstituicaoFinanceiraModel[]>(`${environment.BASE_URL}/api/InstituicaoFinanceira/ListarInstitFinanceirasAtivas/`, header);
    }

    public AlteraStatusInstFinUsr(idInstFinUsr: number, statusNovo: boolean) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<string>(`${environment.BASE_URL}/api/InstFinancUsuario/AlteraStatusInstFinUsr/${idInstFinUsr}/${statusNovo}/`, header);
    }

    public AlteraStatusInstFinanc(idInstFinanc: number, statusNovo: boolean) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<string>(`${environment.BASE_URL}/api/InstituicaoFinanceira/AlteraStatusInstFinanceira/${idInstFinanc}/${statusNovo}/`, header);
    }

    public ManterInstitFinancUsr(dadosInstFinUsr: InstitFinancUsuarioModel) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.post<string>(`${environment.BASE_URL}/api/InstFinancUsuario/ManterInstitFinancUsuario/`, dadosInstFinUsr, header);
    }

    public ManterInstitFinanceira(dadosInstFin: InstituicaoFinanceiraModel) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.post<string>(`${environment.BASE_URL}/api/InstituicaoFinanceira/ManterInstitFinanc/`, dadosInstFin, header);
    }

    public ListarBandeiraCartao(idBandCart: number) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<BandeiraCartaoModel[]>(`${environment.BASE_URL}/api/BandeiraCartao/ListarBandeiraCartao/${idBandCart}`, header);
    }

    public ManterBandeiraCartao(dadosBandeiraCartao: BandeiraCartaoModel) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.post<string>(`${environment.BASE_URL}/api/BandeiraCartao/ManterBandeiraCartao/`, dadosBandeiraCartao, header);
    }

    public AlteraStatusBandeiraCartao(idBandeiraCartao: number, statusNovo: boolean) {
      const header = {
        headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${sessionStorage.getItem('tokenAcesso')}`)
      };
      return this.http.get<string>(`${environment.BASE_URL}/api/BandeiraCartao/AlteraStatusBandeiraCartao/${idBandeiraCartao}/${statusNovo}/`, header);
    }

  }

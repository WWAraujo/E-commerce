import { FormControl, Validators } from '@angular/forms';
import { AtivoInativo, Endereco } from './../../../core/types/type';
import { Component, OnInit } from '@angular/core';
import { ModalenderecoService } from '../modalendereco.service';
import { Router } from '@angular/router';
import { ClienteService } from '../cliente.service';
@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrls: ['./enderecos.component.css']
})
export class EnderecosComponent implements OnInit {
  exibirCabecalho: boolean = true;
  idCliente!: number ;
  enderecos: Endereco[] = [];
  abrirform: boolean = false;
  enderecoPrincipal!: string;
  btnAlterarEndereco: boolean = false;

  endereco: Endereco = {
    id: 0,
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
    ativoInativo: AtivoInativo['ATIVO'],
    enderecoPrincipal: '',
  };

  cepFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{5}-\d{3}$/), // Expressão regular para CEP no formato "12345-678"
  ]);

  constructor(
    private enderecoService: ModalenderecoService,
    private router: Router,
    private clienteService: ClienteService
    ) {}

  ngOnInit(): void {
    this.enderecos = this.enderecoService.getListaEndereco();
    this.idCliente = this.clienteService.getIdCliente();
    if(this.endereco.enderecoPrincipal){

    }
  }

  finalizarEnderecos(){
    try {
      this.enderecos.forEach((endereco) => {
        if (endereco.enderecoPrincipal === 'p'){
          throw new Error('Parar o loop');
        }
      });
      this.enderecos.forEach((endr) => {
        this.selecionarEnderecoPrincipal(endr.cep, endr.numero);
        throw new Error('Parar o loop');
      })
    } catch (e: any) {
      if (e.message === 'Parar o loop') {
        this.enderecoService.setListaEndereco(this.enderecos);
        this.voltarParaTela();
      } else {
        console.log('Erro desconhecido:', e)
      }
    }
  }

  excluirEndereco(end: Endereco){
    this.enderecos.forEach((endereco ) => {
      if (endereco === end) {
        if (endereco.ativoInativo === AtivoInativo['ATIVO']){
          endereco.ativoInativo = AtivoInativo['INATIVO'];
        } else {
          endereco.ativoInativo = AtivoInativo['ATIVO']
        }
      }
    })
  }

  abrirMenu(){
    this.abrirform = true;
  }

  fecharMenu(){
    this.abrirform = false;
  }

  voltarParaTela(){
    if (this.idCliente){
      this.router.navigate(['/alterarCliente'])
    } else{
      this.router.navigate(['/cadastrarCliente'])
      console.log('pulou o alterar cliente')
    }
  }

  alterarEndereco(end: Endereco){
    const index = this.enderecos.findIndex(item => item === end);
    if (index !== 1) {
      // this.enderecoAtual = end;
      this.enderecos.splice(index, 1)
    }
    this.endereco.id = end.id
    this.endereco.logradouro = end.logradouro;
    this.endereco.bairro = end.bairro;
    this.endereco.cidade = end.cidade;
    this.endereco.uf = end.uf;
    this.endereco.numero = end.numero;
    this.endereco.complemento= end.complemento;
    this.endereco.cep = end.cep;
  }

  selecionarEnderecoPrincipal(cep: string, numero: string) {
    this.enderecos.forEach((end) => {
      if (end.cep === cep && end.numero === numero) {
        end.enderecoPrincipal = 'p';
      } else {
        end.enderecoPrincipal = '';
      }
    });
  }

  addendereco() {
    this.enderecos.push({...this.endereco});
    // Limpar os campos em caso de erro ou CEP não encontrado
    this.endereco.logradouro = '';
    this.endereco.bairro = '';
    this.endereco.cidade = '';
    this.endereco.uf = '';
    this.endereco.numero = '';
    this.endereco.complemento= '';
    this.endereco.cep = '';
    this.fecharMenu();
  }

  buscarEnderecoPorCEP(cep: string) {
    if (cep.length === 8) {
      this.enderecoService.buscarEndereco(cep).subscribe((data) => {
        if (!data.erro) {
          this.endereco.logradouro = data.logradouro;
          this.endereco.bairro = data.bairro;
          this.endereco.cidade = data.localidade;
          this.endereco.uf = data.uf;
          this.endereco.numero = '';
          this.endereco.complemento= '';
        } else {
          // Limpar os campos em caso de erro ou CEP não encontrado
          this.endereco.logradouro = '';
          this.endereco.bairro = '';
          this.endereco.cidade = '';
          this.endereco.uf = '';
          this.endereco.numero = '';
          this.endereco.complemento= '';
        }
      });
    }
  }
}

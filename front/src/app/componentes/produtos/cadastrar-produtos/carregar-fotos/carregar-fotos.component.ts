import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdutosService } from '../../produtos.service';
import { ModalService } from '../modal.service';
import { CadastrarProdutosComponent } from '../cadastrar-produtos.component';
import { CarregarFotos } from '../cadastrar-produtos';

@Component({
  selector: 'app-carregar-fotos',
  templateUrl: './carregar-fotos.component.html',
  styleUrls: ['./carregar-fotos.component.css'],
})
export class CarregarFotosComponent implements OnInit {
  file: File | null = null;
  preview!: string;
  fotosProduto: CarregarFotos[] = [];
  imagemPrincipalId: string = '';

  constructor(
    private produtoService: ProdutosService,
    public modalservice: ModalService,
    private cadastrarProduto: CadastrarProdutosComponent
  ) {}

  ngOnInit(): void {}

  concluirUpload() {
    this.cadastrarProduto.receberListaFotos(this.fotosProduto);
    this.modalservice.fecharModal();
  }

  cancelarUpload() {
    this.modalservice.fecharModal();
  }

  getFullPath(imageName: string): string {
    return `http://localhost:8080/api/upload/${imageName}`;
  }

  selecionarImagem(event: any): void {
    this.file = event.target.files[0] as File;
    if (this.file) {
      this.enviarImagem();
    }
  }

  selecionarImagemPrincipal(id: string) {
    this.fotosProduto.forEach((foto) => {
      if (foto.nomeImg === id) {
        foto.flagImg = 'p';
      } else {
        foto.flagImg = '';
      }
      foto.idProduto = 0;
    });
  }

  enviarImagem(): void {
    if (this.file) {
      this.produtoService.enviarImagem(this.file).subscribe(
        (response) => {
          this.fotosProduto.push(response);
          this.selecionarImagemPrincipal(response.nomeImg);
        },
        (error) => {
          console.error('Erro ao enviar a imagem:', error);
        }
      );
    } else {
      alert('Nenhuma imagem selecionada.');
    }
  }
}

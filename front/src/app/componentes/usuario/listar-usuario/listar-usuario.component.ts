import { AlterarUsuario } from '../alterar-uruario';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { ListarUsuario } from './listar-usuarios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrls: ['./listar-usuario.component.css']
})
export class ListarUsuarioComponent implements OnInit {

  listausuario!: ListarUsuario;
  alterarUser!: AlterarUsuario;

  arr: Array<ListarUsuario> = [];

  constructor(
    private router: Router,
    private service: UsuarioService
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();
  }

  listarUsuarios() {
    this.service.listarUsuarios(this.listausuario).subscribe((listausuario) => {
      this.arr = listausuario;
      console.log(this.arr)
    })
  }

  deletarUsuario(itemId: number){
    this.service.excluir(itemId).subscribe(() => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload'
      this.router.navigate([this.router.url])
    })
  }

  recarregarComponente() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload'
    this.router.navigate([this.router.url])
  }

  cadastrarNovo(){
    this.router.navigate(['/cadastrarUsuario'])
  }

  alterarUsuario(itemId: number){

    console.log('id usuario',itemId)
    console.log('construtor do usuario vazio',this.alterarUser)

    this.service.procurarPorId(itemId).subscribe((usuario) => {
      this.alterarUser = usuario
    })

    console.log('usuario para alterar',this.alterarUser)

    this.service.setAlterarUsuario(this.alterarUser)

    if (this.alterarUser) {
      this.router.navigate(['/alterarUsuario'])
    }
  }
}

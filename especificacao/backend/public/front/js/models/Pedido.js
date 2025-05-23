export class Pedido {
  constructor(id, cliente, endereco, itens) {
    this.id = id;
    this.cliente = cliente;
    this.endereco = endereco;
    this.itens = itens;
  }
}
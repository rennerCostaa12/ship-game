function Nave(context, teclado, imagem, imgExplosao, isPressionedLeft, isPressionedRight, isPressionedTop, isPressionedBottom) {
  this.context = context;
  this.teclado = teclado;
  this.imagem = imagem;
  this.x = 0;
  this.y = 0;
  this.velocidade = 0;
  this.spritesheet = new Spritesheet(context, imagem, 3, 2);
  this.spritesheet.linha = 0;
  this.spritesheet.intervalo = 100;
  this.acabaramVidas = null;
  this.vidasExtras = 3;
  this.imgExplosao = imgExplosao;
}

Nave.prototype = {
  atualizar: function () {
    var incremento = this.velocidade * this.animacao.decorrido / 1000;

    if (isPressionedLeft && this.x > 0)
      this.x -= incremento;

    if (isPressionedRight && this.x < this.context.canvas.width - 36)
      this.x += incremento;

    if (isPressionedTop && this.y > 0)
      this.y -= incremento;

    if (isPressionedBottom && this.y < this.context.canvas.height - 48)
      this.y += incremento;

  },
  desenhar: function () {
    if (isPressionedLeft)
      this.spritesheet.linha = 1;
    else if (isPressionedRight)
      this.spritesheet.linha = 2;
    else
      this.spritesheet.linha = 0;
    
    this.spritesheet.desenhar(this.x, this.y);
    this.spritesheet.proximoQuadro();

  },
  atirar: function () {
    var tiro = new Tiro(this.context, this);
    this.animacao.novoSprite(tiro);
    this.colisor.novoSprite(tiro);
  },
  retangulosColisao: function () {
    var rets = [
                  {x: this.x+2, y:this.y+19, largura: 9, altura: 13},
                  {x: this.x+13, y:this.y+3, largura: 10, altura: 33},
                  {x: this.x+25, y:this.y+19, largura: 9, altura: 13},
               ];
    // var ctx = this.context;
    // for(var i in rets){
    //   ctx.save();
    //   ctx.strokeStyle = 'yellow';
    //   ctx.strokeRect(rets[i].x, rets[i].y, rets[i].largura, rets[i].altura);
    //   ctx.restore();
    // }
    return rets;
  },
  colidiuCom: function (outro) {
    if (outro instanceof Ovni) {
      this.animacao.excluirSprite(this);
      this.animacao.excluirSprite(outro);
      this.colisor.excluirSprite(this);
      this.colisor.excluirSprite(outro);

      var exp1 = new Explosao(this.context, this.imgExplosao, this.x, this.y);
      var exp2 = new Explosao(this.context, this.imgExplosao, outro.x, outro.y);

      this.animacao.novoSprite(exp1);
      this.animacao.novoSprite(exp2);

      var nave = this;
      exp1.fimDaExplosao = function () {
        nave.vidasExtras--;
        if (nave.vidasExtras < 1) {
          if (nave.acabaramVidas) nave.acabaramVidas();
        }
        else {
          // Recolocar nave no cenário
          nave.colisor.novoSprite(nave);
          nave.animacao.novoSprite(nave);
          nave.posicionar();
        }
      }
    }
  },
  posicionar: function () {
    var canvas = this.context.canvas;
    this.x = canvas.width / 2 - 18;
    this.y = canvas.height - 48;
  }
}
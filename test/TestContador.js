var Contador = artifacts.require("../contracts/Contador.sol");

contract('Usamos un Contador:', accounts => {

  let contador;

  before(async () => {
    contador = await Contador.deployed();
  });


  it("el valor inicial debe ser 0", () => {
    return contador.valor.call()
    .then(function(value) {
      assert.equal(value.valueOf(), 0, "El valor inicial no es 0.");
    });
  });


  it("el valor inicial debe ser 0", async () => {
    const value = await contador.valor.call();
    assert.equal(value.valueOf(), 0, "El valor inicial no es 0.");
  });

  it("incrementar en uno el contador", () => {

    let c1, c2;

    return contador.valor.call()
    .then(value => {
      c1 = value;
      contador.incr(); 
    })
    .then(() => contador.valor.call() )
    .then(value => {
      c2 = value;

      const incr = c2 - c1;
      assert.equal(incr.valueOf(), 1, "El incremento del valor no es 1.");
    });
  });
  
  it("decrementar en uno el contador", () => {

    let c1, c2;

    return contador.valor.call()
    .then(value => {
      c1 = value;
      contador.decr(); 
    })
    .then(() => contador.valor.call() )
    .then(value => {
      c2 = value;

      const decr = c1 - c2;
      assert.equal(decr.valueOf(), 1, "El decremento del valor no es 1.");
    });
  });


  it("incrementa en cuatro el contador", async () => {

    let c1 = await contador.valor.call();
    await contador.incr(); 
    await contador.incr(); 
    await contador.incr(); 
    await contador.incr(); 
    let c2 = await contador.valor.call();

    const incr = c2 - c1;
    assert.equal(incr.valueOf(), 4, "El incremento del valor no es 4.");
  });
  
  it("decrementa en cuatro el contador", async () => {

    let c1 = await contador.valor.call();
    await contador.decr(); 
    await contador.decr(); 
    await contador.decr(); 
    await contador.decr(); 
    let c2 = await contador.valor.call();

    const decr = c1 - c2;
    assert.equal(decr.valueOf(), 4, "El decremento del valor no es 4.");
  });

});

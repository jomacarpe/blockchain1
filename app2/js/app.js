App = {
    web3Provider: null,
    Contador: null,   // Abstracción del contrato.
    contador: null,   // Instancia desplegada.

    init: function() {
        console.log("Inicializando App.");

        App.initWeb3();
    },

    initWeb3: function() {
        console.log("Inicializando web3.");

        // Si hay inyectada una instancia de web3:
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // Uso Ganache porque no hay una instancia de web3 inyectada.
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        App.initContractAbstracts();
    },

    initContractAbstracts: function() {
        console.log("Inicializando abstracción del contrato.");

        // Cargar el artefacto del contrato Contador (json)
        $.getJSON('Contador.json', function(json) {

            // Crear la abstraccion del contrato Contador
            App.Contador = TruffleContract(json);

            // Provisionar el contrato con el proveedor web3
            App.Contador.setProvider(App.web3Provider);

            App.initContractInstance();
        });
    },

    initContractInstance: function() {
        console.log("Obtener instancia desplegada del contador.");

        App.Contador.deployed()
        .then(function(contador) {

            App.contador = contador;

            console.log("Configurar Vigilancia de los eventos del contador.");
            contador.Tic((err, event) => {
                console.log("Se ha producido un evento Tic:");
                if (err){
                    console.log(err);
                } else {
                    var msg = event.args.msg;
                    var out = event.args.out;
                    console.log(" * Msg =", msg);
                    console.log(" * Out =", out.valueOf());

                    $('#valor').text(out.valueOf());
                }
            });

            App.bindEvents();

        })
        .catch(function(err) {
            console.log(err.message);
        });
    },


    bindEvents: function() {
        console.log("Configurando manejador de eventos del boton.");

        $(document).on('click', '#cincr', App.handleIncr);
        $(document).on('click', '#cdecr', App.handleDecr);

        App.refreshContador();
    },

    handleIncr: function(event) {
        console.log("Se ha hecho Click en el botón.");

        event.preventDefault();

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            const account = accounts[0];

            console.log("Cuenta =", account);

            // Ejecutar incr como una transacción desde la cuenta account.
            App.contador && App.contador.incr({from: account})
            .then(function() {
                App.refreshContador();
            })
            .catch(function(err) {
                console.log(err.message);
            });
        });
    },

    handleDecr: function(event) {
        console.log("Se ha hecho Click en el botón.");

        event.preventDefault();

        web3.eth.getAccounts(function(error, accounts) {
            if (error) {
                console.log(error);
            }

            const account = accounts[0];

            console.log("Cuenta =", account);

            // Ejecutar decr como una transacción desde la cuenta account.
            App.contador && App.contador.decr({from: account})
            .then(function() {
                App.refreshContador();
            })
            .catch(function(err) {
                console.log(err.message);
            });
        });
    },


    refreshContador: function() {
        console.log("Refrescando el valor mostrado del contador.");

        App.contador && App.contador.valor.call()
        .then(function(valor) {
            console.log("Valor =", valor.valueOf());

            $('#valor').text(valor); 
        })
        .catch(function(err) {
            console.log(err.message);
        });
    }

};

// Ejecutar cuando se ha terminado de cargar la pagina.
$(function() {
  $(window).load(function() {
    App.init();
  });
});

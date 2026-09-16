const express = require('express');
const cors = require('cors');
const connection = require('./db');

const server = express();

server.use(cors());
server.use(express.json());


server.get('/produtos', (req, res) => {
    const sql = 'SELECT * FROM PRODUTO';

    connection.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ erro: erro.message });
        }
       return res.json(resultados);
    });
});


server.get('/produtos/ordenados', (req, res) => {
    const sql = 'SELECT * FROM PRODUTOS ORDER BY NOME ASC';

    connection.query(sql, (erro, resultado) => {
        if(erro){
            return res.status(500).json({erro: erro.message });
        }
        return res.json(resultado);
    })
}) 

//GET /produtos/:id

server.get('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM PRODUTOS WHERE idProdutos = ?';

    connection.query(sql, [id], (erro, resultado) => {
        if(erro){
            return res.status(500).json({erro: erro.message });
        }
        return res.json(resultado);
    })
})

//GET /produtos/busca/:nome

server.get('/produtos/busca/:nome', (req, res) => {
    const termoBusca = '%' + req.params.nome + '%';
    const sql = 'SELECT * FROM PRODUTOS WHERE NOME LIKE ?';

    connection.query(sql, [termoBusca], (erro, resultado) => {
        if(erro){
            return res.status(500).json({erro: erro.message });
        }
        return res.json(resultado);
    });
});

server.post('/produtos', (req, res) => {
    const { nome, cor, textura, peso, unidade_medida, aplicacao, 
        data_validade, estoque_minimo, estoque_atual, preco_unitario, id_categoria 
    } = req.body;
   
    if(nome == null || peso == null || unidade_medida == null || aplicacao == null || 
        data_validade == null || estoque_minimo == null || estoque_atual == null || preco_unitario == null || id_categoria == null
    ){

        return res.status(400).json({ erro: 'todos camp  os obrigatorios devem ser preenchidos.' });
    }

    const sql = `INSERT INTO PRODUTOS (NOME, COR, TEXTURA, PESO, UNIDADE_MEDIDA,
     APLICACAO, DATA_VALIDADE, ESTOQUE_MINIMO, ESTOQUE_ATUAL, PRECO_UNITARIO,
      ID_CATEGORIA) VALUES (? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)
        `

    connection.query (sql, [nome, cor, textura, peso, unidade_medida, 
        aplicacao, data_validade, estoque_minimo, estoque_atual, 
        preco_unitario, id_categoria]), (erro, resultado) => {

            if(erro){
                return res.status(500).json({ erro: erro.message });
            }

            res.json({ mensagem: 'Produto inserido com sucesso!',
                 id: resultado.insertId 
                });
            };
        })

const PORT = 3025;

server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

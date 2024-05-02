import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {

  // Criando a state que armazenara as fotos dos gatos 
  const [cats, setCats] = useState([])

  // Funcao para buscar os gatos pela primeira vez e jogar as imagens para o banco de dados
  const getCats = async () => {
    // Requisicao para a The Cat API para obter as imagens
    const response = await axios('https://api.thecatapi.com/v1/images/search?limit=10');
    const APIcats = response.data;

    // Envio das informações das imagens obtidas para o back end PHP hospedado no localhost que ira salvar as imagens no banco
    // de dados caso ainda nao haja imagens nele, e caso ja tenha imagens, as novas informacoes serao ignoradas.
    await fetch('http://localhost/galleryphp/recebedor.php', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(APIcats)
    })
    .then(response => response.json())
      .then(data => {
        // Caso o envio as informações tenham sido armazenadas corretamente  esse trecho atualiza as informacoes na tela 
        setCats(data.retorno);
      })
      .catch(error => {console.error("Erro ao enviar a requisição: ", error)});
  };

  // Funcao que adiciona uma foto aleatoria da API ao banco de dados e atualiza a tela com a nova imagem entre as antigas
  const newCat = async () => {
    const response = await axios("https://api.thecatapi.com/v1/images/search");
    let newCat = response.data;

    // enviando os dados para o arquivo do back end responsavel por adicionar a nova imagem no banco de dados.
    await fetch('http://localhost/galleryphp/addCat.php', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newCat)
    })
    .then(response => response.json())
      .then(data => {
        // retorna a lista de fotos inteira e atualizada para dentro da state cats atualizando assim a tela
        setCats(data.retorno)
        console.log("Adicionada a imagem: ", data.retorno);
      })
      .catch(error => {console.error("Erro ao enviar a requisição: ", error)});    
  }

  const deleteCat = async (id) => {
    await fetch('http://localhost/galleryphp/deleteCat.php', {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(id)
    })
    .then(response => response.json())
      .then(data => {
        // retorna a lista de fotos inteira e atualizada para dentro da state cats atualizando assim a tela
        setCats(data.retorno)
      })
      .catch(error => {console.error("Erro ao enviar a requisição: ", error)});
  };

  // chamada da funcao de exibir as fotos
  useEffect(()=>{
    getCats();
  }, [])

  //Geracao da interface da aplicacao
  return (
    <div className="App">
      <div className='title'>The Cat gallery</div>
      <div className='gallery'>
        {cats.map((item, index)=>
          <div className='imageCard' key={item.id}>
            <img src={item.url} width={300} height={250}></img>
            <p className='close-btn' onClick={()=>{deleteCat(item.id)}}>Excluir</p>
          </div>
    )}
      </div>
      <div className='addButton' onClick={newCat}>Add new img</div>
    </div>
  );
}

export default App;

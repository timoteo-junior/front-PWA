# Frontend do CRUD de Filmes (PWA)

Interface em HTML, CSS e JavaScript Vanilla que consome a API RESTful de filmes, com suporte a funcionalidades de Progressive Web App (PWA).

## Deploy na Nuvem
A aplicação está hospedada e pode ser testada diretamente no navegador através do link:
**https://pwa-filmes.netlify.app/**

## Executar Localmente

1. Certifique-se de que a API do backend está rodando.
2. Abra a pasta do frontend em um terminal.
3. Execute um servidor HTTP local:

```bash
npx serve .
```

4. Acesse o endereço local informado pelo terminal (ex: `http://localhost:3000`).
*Atenção: Não abra o arquivo `index.html` diretamente no navegador. O servidor HTTP é estritamente necessário para o funcionamento correto dos Service Workers do PWA.*

## Configuração da API

A comunicação com o backend é gerida pela constante `API_URL` no topo do arquivo `app.js`. 
Para alternar entre o ambiente de nuvem e o local, comente/descomente as linhas:

```javascript
// Produção (Render)
const API_URL = "[https://seu-link-do-render.onrender.com/filmes](https://seu-link-do-render.onrender.com/filmes)"; 

// Desenvolvimento Local
// const API_URL = "http://localhost:3000/filmes";
```

## Operações Suportadas

| Ação | Método HTTP | Rota Consumida |
|---|---|---|
| Listar catálogo | GET | `/filmes` |
| Buscar (ID/Título) | GET | `/filmes/:id` |
| Cadastrar novo | POST | `/filmes` |
| Atualizar dados | PUT | `/filmes/:id` |
| Excluir filme | DELETE | `/filmes/:id` |
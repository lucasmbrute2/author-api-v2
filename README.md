# Welcome to Author API v2

O Author API v2 é a versão melhorada do Author Api, alguns pontos mudaram, principalmente em relação a testes. Todos os uses-cases/services estão testados com unit tests, também estão presentes testes e2e. O services estão mais claros e limpos, as variáveis estão melhores declaradas e a validação ocorre por middlewares utilizando a biblioteca ZOD.


## Como inicar o projeto: 
```
- Preencher as variáveis ambiente
- Rodar o comando docker compose up 
- Rodar o comando npm run start:dev
```

## Como testar
Estão presentes testes unitário e testes e2e
```
npm run test:watch
npm run test:e2e:watch
```

![image](https://user-images.githubusercontent.com/68877260/226893002-fc0acf82-9217-44cb-8845-9962c401ba55.png)


## Rotas

![image](https://user-images.githubusercontent.com/68877260/226893483-81f02659-bf79-4bc1-9006-dec9df8baa0a.png)

Essas são as rotas disponíveis, para acessar a entidade de usuário as todas rotas terão o prefixo '/author' e '/picture' para rodas que interagem com as fotos

POST author/

Registrar um usuário.
Expected body: 
```  
* name: string
* username: string unique
* password: string
* confirmPassword: string
```  

PATCH author/token/refresh
- Atualiza o access token do usuário para que não tenha que logar na aplicação novamente. O refresh token é salvo nos cookies com a flag httpOnly na criação/autenticação do usuário. 
```
Apesar de ser um método patch, não possui um corpo de requisição.
```
POST author/session

Autenticar um usuário.

expected body: 
```
* username: string unique
* password: string
```

POST picture/

Você deve poder fazer upload de uma foto. Deverá enviar um jwt token nos headers.

* selecione Multipartform

expected body:

```
picture: file
```


GET picture/me/search

Procura todas as fotos que aquele usuário fez upload, retornando 10 por vez. Aceite um queryParam page indicando o número da página. 
* Precisa enviar um JWT token nos headers.


DELETE /picture/:aliasKey
- Esta rota permite a deleção de uma imagem baseada em sua aliasKey, o usuário deve enviar um token JWT válido pelo headers

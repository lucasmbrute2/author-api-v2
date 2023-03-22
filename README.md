# Welcome to Author API v2

O Author API v2 é a versão melhorada do Author Api, alguns pontos mudaram, principalmente em relação a testes. Todos os uses-cases/services estão testado com unit tests, também estão presentes testes e2e. O services estão mais claros e limpos, as variáveis estão melhores declaradas e a validação ocorre por middlewares utilizando a biblioteca ZOD.


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

author/

Registrar um usuário.
Expected body: 
```  
* name: string
* username: string unique
* password: string
* confirmPassword: string
```  

author/session

Autenticar um usuário.

expected body: 
```
* username: string unique
* password: string
```

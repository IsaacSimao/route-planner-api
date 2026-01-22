Route Planner API
API REST desenvolvida em Node.js
Projeto desenvolvido em aula da faculdade Fatec, a partir de um desafio proposto pelo meu professor em sala de aula. A ideia foi criar um projeto para cálculos rotas, tempo de percurso (ETA) e validações de horário.
Com foco em organização, clareza e evolução futura (integração com APIs de mapas).

Funcionalidades
• Cálculo de horário estimado de chegada (ETA)
• Cálculo de tempo de viagem com base em distância e velocidade média
• Validação de horário no formato HH:mm

Tecnologias Utilizadas
• Node.js
• Express
• Jest (testes automatizados)
• Nodemon (ambiente de desenvolvimento)
• JavaScript (ES Modules)

Estrutura do Projeto
route-planner-api/
├── src/
│ ├── controllers/ # Entrada e validação de dados
│ ├── services/ # Regras de negócio
│ ├── routes/ # Definição das rotas
│ ├── utils/ # Funções utilitárias (datas, validações)
│ ├── app.js # Configuração do Express
│ └── server.js # Inicialização do servidor
│
├── tests/ # Testes automatizados
├── .env.example # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json
└── README.md

👨‍💻 Desenvolvido para fins de estudo e portfólio.

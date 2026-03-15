👻 GhostKey - Gerenciador de Senhas Offline
O GhostKey é um gerenciador de senhas local desenvolvido com Node.js. Ele utiliza criptografia autenticada de nível militar para garantir que seus dados permaneçam privados e íntegros, rodando inteiramente na sua máquina.

### 🛠️ Tecnologias e Ferramentas
Ambiente: Node.js

Framework Web: Express (Roteamento e API)

Segurança: Módulo nativo crypto do Node.js

Criptografia: AES-256-GCM (Authenticated Encryption)

Derivação de Chave: scrypt (para fortalecer a SECR3T_KEY)

Persistência: JSON Local (db.json)

Variáveis de Ambiente: dotenv

Segurança de Origem: Middleware CORS

🔒 Arquitetura de Segurança
O projeto implementa o algoritmo AES-256-GCM, oferecendo três camadas de proteção:

Confidencialidade: Os dados são cifrados com uma chave de 256 bits gerada via scryptSync.

Integridade: O uso de Auth Tags garante que, se alguém alterar um único byte no seu db.json, o sistema detectará a manipulação e impedirá a descriptografia.

Aleatoriedade: Cada registro possui um IV (Vetor de Inicialização) exclusivo de 12 bytes, garantindo que a mesma senha nunca gere o mesmo hash visual duas vezes.

🚀 Como Configurar e Rodar

### 1. Clonar e Instalar
No seu terminal, execute:

git clone https://github.com/rodriguesMatheusDev/GhostKey.git

cd GhostKey

npm install

### 2. Alterar SECR3Tkey
Va até o .env e altere a SECR3Tkey pra uma de sua preferencia

SECR3T_KEY=sua_key

### 3. Executar o Servidor
npm start

O servidor iniciará em: http://localhost:3000

📂 Fluxo do Aplicativo

Cadastro: O usuário cria uma conta. A senha de acesso é criptografada antes de ser salva.

Login: O sistema valida a identidade descriptografando o hash armazenado e comparando com a entrada.

Gerenciamento: Após o login, o usuário pode salvar senhas de diferentes serviços, que são armazenadas de forma segura vinculadas ao seu userId.

Recuperação: As senhas salvas só podem ser visualizadas através da rota de descriptografia, que exige a chave correta do servidor.

Este projeto foi desenvolvido para fins de estudo sobre segurança em Node.js.

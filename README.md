🔐 GhostKey

Um gerenciador de senhas local desenvolvido com **Node.js** e **AES-256-GCM**, focado em demonstrar conceitos de criptografia simétrica reversível.

## 🚀 Como Funciona
O projeto utiliza uma arquitetura onde o Banco de Dados é "cego". 
1. **Entrada:** A senha limpa é enviada ao servidor.
2. **Criptografia:** O servidor utiliza uma **SECR3Tkey** (armazenada em `.env`) e o algoritmo **AES-256-GCM** para gerar um Hash único.
3. **Armazenamento:** Apenas o Hash e o IV (Vetor de Inicialização) são salvos no arquivo `db.json`.
4. **Saída:** A senha só é descriptografada sob demanda, enviando o hash de volta ao servidor que possui a chave mestre.

## 🛡️ Segurança
- **AES-256-GCM:** Garante não apenas a confidencialidade, mas também a integridade do dado (impede alterações manuais no banco).
- **Isolamento de Chave:** A Master Key nunca sai do servidor e nunca é enviada ao Front-end.
- **IV Único:** Mesmo senhas iguais geram hashes diferentes no banco de dados.

## 🛠️ Tecnologias
- Node.js
- Express
- Crypto API (Nativo do Node)
- LocalStorage/JSON para persistência
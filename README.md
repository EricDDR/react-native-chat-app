# React Native Simple Chat 💬

Um aplicativo de chat simples e funcional construído com React Native. Este projeto foi criado como um estudo de caso para demonstrar boas práticas no desenvolvimento mobile, incluindo gerenciamento de estado com Hooks, comunicação com API e uma excelente experiência do usuário com Atualização Otimista (Optimistic UI).

## ✨ Features

* **Visualização de Mensagens:** Exibe a conversa em formato de "bolhas" de chat.
* **Diferenciação de Remetente:** Estilos diferentes para as suas mensagens e as dos outros.
* **Envio em Tempo Real (Simulado):** Envio de mensagens para um servidor backend.
* **Atualização Automática:** Novas mensagens são buscadas a cada 3 segundos (polling).
* **Atualização Otimista:** As mensagens aparecem na tela instantaneamente, antes da confirmação do servidor, proporcionando uma experiência de usuário fluida e rápida.
* **Puxar para Atualizar:** Funcionalidade para recarregar as mensagens manualmente.
* **Feedback de UI:** Indicadores de carregamento durante operações de rede.

## 🛠️ Tecnologias Utilizadas

* **[React Native](https://reactnative.dev/)**: Framework para criação de aplicativos móveis nativos com JavaScript.
* **[React Hooks](https://reactjs.org/docs/hooks-intro.html)**: Para gerenciamento de estado e ciclo de vida do componente (`useState`, `useEffect`, `useCallback`).
* **[Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)**: Para comunicação com o servidor backend.
* **JavaScript (ES6+)**
* **Flexbox** para layout.

## 🚀 Como Executar o Projeto

Para rodar este projeto localmente, você precisará de um ambiente de desenvolvimento React Native configurado. Recomenda-se o uso do [Expo](https://expo.dev/).

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (versão LTS recomendada)
* [Yarn](https://classic.yarnpkg.com/en/docs/install/) ou npm
* [Expo Go](https://expo.dev/go) app no seu smartphone (iOS ou Android)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    cd seu-repositorio
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    # ou
    npm install
    ```

3.  **Configure a API:**
    Este aplicativo precisa se conectar a um servidor backend.
    * **Certifique-se de que seu servidor de chat esteja rodando.**
    * Abra o arquivo `App.js` e **altere a constante `API_URL_BASE`** para o endereço IP da sua máquina na sua rede local.
        ```javascript
        // Exemplo:
        const API_URL_BASE = "[http://192.168.0.103:8080/messages](http://192.168.0.103:8080/messages)";
        ```

4.  **Inicie o projeto:**
    ```bash
    npx expo start
    ```

5.  **Abra no seu celular:**
    Após o comando acima, um QR code será exibido no terminal. Abra o aplicativo **Expo Go** no seu celular e escaneie o QR code para carregar o aplicativo.

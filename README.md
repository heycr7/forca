# Forca

Jogo da forca em português, feito com HTML, CSS e JavaScript sem dependências de build.

## Jogar localmente

Abra `public/index.html` no navegador ou inicie um servidor estático na pasta `public`.

## Agentes do GitHub Copilot

Os agentes personalizados estão em `.github/agents/`:

- **hangman-game**: implementa e aprimora o jogo.
- **hangman-reviewer**: revisa gameplay, acessibilidade e responsividade.
- **hangman-deployer**: cuida das configurações de publicação.

## Publicação

Os workflows em `.github/workflows/` publicam o site em cada push para `main` ou quando executados manualmente pela aba **Actions** do GitHub.

- **GitHub Pages**: em **Settings → Pages**, selecione **GitHub Actions** como origem antes da primeira execução. O workflow publica os arquivos de `public/` e não precisa de permissão para alterar configurações do repositório.
- **Cloudflare Pages**: crie um projeto Pages por upload direto chamado `forca` (sem integração Git, pois o workflow faz o deploy), configure os segredos `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` em **Settings → Secrets and variables → Actions** no repositório e crie a variável `CLOUDFLARE_PAGES_ENABLED` com o valor `true`. O token precisa de permissão para publicar no Cloudflare Pages. Sem essa configuração, o workflow fica ignorado.

Depois dessas configurações, os dois serviços recebem novas versões automaticamente a cada push para `main`.
# Fila Virtual - Sorvete na Chapa

Aplicação web simples para gerenciar fila por fichas físicas com QR Code.

## Estrutura

- `index.html`: marcação da interface (layout atendente/cliente + tela inicial).
- `styles.css`: estilos da aplicação.
- `app.js`: regras de negócio da fila, sincronização em tempo real e renderização.

## Como usar

1. Abra o `index.html` no navegador.
2. Na tela inicial, escolha **Atendente** ou **Cliente**.
3. Use os botões no topo para alternar as visões quando quiser.
4. Atendente:
   - escolhe sabor;
   - escolhe ficha (1-10);
   - adiciona na fila;
   - marca como **Entregue** para avançar.
5. Cliente:
   - seleciona a ficha ou acessa via URL `?modo=cliente&ficha=NUMERO`.
   - acompanha a fila em tempo real sem precisar F5.

## Observações de teste

- Estado compartilhado via `localStorage` + `BroadcastChannel` (sincroniza entre abas).
- Para mostrar sua logo, use `?logo=https://url-da-sua-logo`.
- Para validar deploy/cache, confira o selo de versão na tela inicial: `2026.04.26-v3`.

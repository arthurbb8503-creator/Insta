# Fila Virtual - Sorvete na Chapa

Versão em **arquivo único** para facilitar upload manual no GitHub Pages.

## Arquivo

- `index.html`: contém HTML + CSS + JavaScript da aplicação.

## Como usar

1. Abra o `index.html` no navegador.
2. Na tela inicial, escolha **Atendente** ou **Cliente**.
3. Atendente:
   - escolhe sabor;
   - escolhe ficha (1-10);
   - adiciona na fila;
   - marca como **Entregue** para avançar.
4. Cliente:
   - seleciona a ficha ou acessa via URL `?modo=cliente&ficha=NUMERO`.
   - acompanha a fila em tempo real sem precisar F5.

## Observações

- Para mostrar sua logo, use `?logo=https://url-da-sua-logo`.
- Estado compartilhado via `localStorage` + `BroadcastChannel` (sincroniza entre abas).
- Se o navegador bloquear `localStorage` (modo privado), a fila segue com cache em memória na aba atual.
- Versão visível na tela inicial: `2026.04.26-v4`.

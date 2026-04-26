# Fila Virtual - Sorvete na Chapa

Aplicação web simples (HTML/CSS/JS) para gerenciar fila por fichas físicas com QR Code.

## Como usar

1. Abra o `index.html` no navegador.
2. Use os botões **Atendente** e **Cliente** para alternar as visões.
3. Atendente:
   - escolhe sabor;
   - escolhe ficha (1-10);
   - adiciona na fila;
   - marca como **Entregue** para avançar.
4. Cliente:
   - seleciona a ficha ou acessa via URL `?modo=cliente&ficha=NUMERO`.
   - acompanha a fila em tempo real sem precisar F5.

## Observações de teste

- Estado compartilhado via `localStorage` + `BroadcastChannel` (sincroniza entre abas).
- Para mostrar sua logo, use `?logo=https://url-da-sua-logo`.

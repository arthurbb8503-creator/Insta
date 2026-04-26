# Fila Virtual - Sorvete na Chapa

Projeto web simples para fila virtual com fichas físicas (1-10) e QR Code.

## Arquivos alterados (mínimo)

- `index.html`: interface + lógica da fila (atendente e cliente).
- `README.md`: instruções de uso.

## Como usar

1. Abra o `index.html`.
2. Na tela inicial escolha **Atendente** ou **Cliente**.
3. Atendente: seleciona sabor, seleciona ficha e adiciona na fila.
4. Marque **Entregue** para a fila avançar automaticamente.
5. Cliente: acompanha posição sem F5 e recebe status “em preparação” quando vira o próximo.

## QR por ficha

Cada ficha pode usar URL:

`?modo=cliente&ficha=NUMERO`

## Versão de validação

`2026.04.26-v4`

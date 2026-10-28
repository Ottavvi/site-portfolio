# Bancada — ordens de serviço

Sistema de ordens de serviço para assistência técnica (celular, notebook, tablet, console). Roda no navegador,
sem servidor e sem instalação: os dados ficam salvos no próprio navegador, com backup em arquivo.

## O que faz

- **Quadro por status**: Recebido → Em análise → Aguardando aprovação → Em conserto → Pronto para retirar →
  Entregue. Arraste o cartão entre colunas ou troque o status na OS. OS com prazo vencido ficam marcadas.
- **Resumo**: OS em aberto e atrasadas, orçamentos esperando aprovação, valor a receber das prontas e o total
  entregue no mês.
- **OS completa**: cliente, aparelho, série/IMEI, acessórios, defeito, prazo, orçamento com peças e serviços,
  desconto, anotações da bancada e histórico com data e hora de cada mudança.
- **Avisar no WhatsApp**: a mensagem muda conforme o status (recebido, orçamento com os itens, pronto, garantia).
- **Entrega**: forma de pagamento e garantia de 90 dias contada a partir do dia.
- **Impressão**: A4 com via da loja e via do cliente, termos de garantia e campo de assinatura.
- **Busca** por número, cliente, telefone, aparelho ou defeito.
- **Menu**: exportar planilha CSV (abre no Excel), baixar e restaurar backup, voltar aos dados de exemplo.
- Tema claro e escuro conforme o sistema.

## Como abrir

```
npx serve .
```

ou a extensão Live Server do VS Code.

## Estrutura

```
index.html
css/app.css        layout, quadro, gaveta da OS e folha de impressão
js/estado.js       status, dados de exemplo e gravação no navegador
js/app.js          quadro, OS, nova OS, menu
js/imprimir.js     as duas vias da OS
fontes/            Outfit e JetBrains Mono (licença OFL)
```

Os dados da loja (nome, endereço, telefone) que saem na impressão ficam em `estado.loja`, em `js/estado.js`.

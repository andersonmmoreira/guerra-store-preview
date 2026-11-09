# Estúdio de Stories — ativação do acesso

O site usa Cloudflare Access com código de acesso por e-mail. Não há senha,
chave de acesso nem desbloqueio por localStorage no código do navegador.
Sem configuração, `/api/studio/session` retorna `authenticated: false`.

1. No Cloudflare Zero Trust, configurar uma aplicação Access para o endereço
   `guerra-store.pages.dev/api/studio/login` (não proteger o site inteiro).
2. Ativar One-time PIN e permitir exclusivamente o e-mail informado pelo Anderson.
3. Nas variáveis de produção do projeto Pages `guerra-store`, adicionar:
   - `STUDIO_TEAM_DOMAIN`: domínio da equipe, como `equipe.cloudflareaccess.com`.
   - `STUDIO_AUDIENCE`: AUD da aplicação Access criada.
   - `STUDIO_EMAIL`: o mesmo e-mail autorizado na política.
4. Fazer nova implantação para aplicar as variáveis. Testar entrada e saída,
   e conferir que outro e-mail é recusado.

Entrada: `/admin` → Entrar com meu e-mail → Access → volta ao painel.
O endpoint valida a assinatura RS256 do JWT com as chaves oficiais da equipe,
issuer, audience, expiração e e-mail. Uma resposta pública não carrega o e-mail.
As respostas de sessão não usam cache. A área não altera preços nem publica no Instagram.

Stories são compostos no navegador em canvas 1080×1920 usando as mídias do próprio
site. Download usa PNG; Compartilhar usa Web Share com um arquivo PNG, somente
quando o aparelho declara suporte. Cancelar não baixa nem publica automaticamente.
Instagram é escolhido pelo usuário na folha de compartilhamento do aparelho.

## Solicitações de preço

O campo de lista livre prepara um TXT com referência UUID, data real e status
pendente de envio/aprovação. O rascunho fica em localStorage no aparelho do usuário.
Não há fila remota, notificação automática, publicação nem integração direta com
conversas do Codex. O usuário deve encaminhar o pedido ao Anderson, que o traz à
conversa e dá aprovação expressa antes de atualizar o catálogo. O pedido pode ser
copiado ou baixado. Não tratar a preparação do pedido como envio ou aprovação.

Referências:
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API

# Estúdio de Stories — acesso exclusivo

Entrada: `/admin`, com e-mail e senha. O projeto Cloudflare Pages `guerra-store`
usa o segredo criptografado `STUDIO_AUTH` e o binding D1 `STUDIO_DB`.
Nenhuma senha, hash, salt ou pepper deve ser incluído no repositório.

`STUDIO_AUTH` contém email, iterations=100000, salt aleatório, pepper aleatório e
hash. O hash usa HMAC-SHA256 com pepper antes de PBKDF2-SHA256. O servidor só
aceita as credenciais configuradas. Não existe cadastro público ou recuperação
automática de senha. Alterações de acesso são feitas pelo responsável do site.

`STUDIO_DB` tem as tabelas `studio_sessions` e `studio_login_limits`. Sessões usam
tokens aleatórios de 256 bits; apenas SHA256 do token é armazenado. O cookie é
Secure, HttpOnly, SameSite=Strict, Path=/ e prefixado com __Host-. Duração: 8 horas.
Logout revoga a sessão no banco. Respostas de autenticação nunca usam cache.
Login e logout exigem POST de mesma origem. Tentativas são limitadas de forma
persistente: 8 por 5 minutos por IP e 40 por 15 minutos no total. O banco guarda
somente um identificador derivado do IP com segredo, sem IP em texto puro.
O acesso fica fechado se a configuração ou o banco estiverem indisponíveis.

As funções estão limitadas a `/api/studio/*`. Deploys de preview sem os bindings
de produção ficam fechados. Nunca criar desbloqueio de administrador por URL ou
localStorage. Não há permissão para alterar preços automaticamente.

Stories são compostos no navegador em canvas 1080×1920 usando mídias do próprio
site. Download gera PNG. Compartilhar usa Web Share com o arquivo, se disponível.
O usuário escolhe o aplicativo e conclui a publicação; Instagram não é aberto
nem recebe publicações automaticamente.

## Solicitações de preço

O campo de lista livre prepara um TXT com referência UUID, data real e status
pendente de envio/aprovação. O rascunho fica em localStorage no aparelho do usuário.
Não há fila remota, notificação automática, publicação nem integração direta com
conversas do Codex. O usuário deve encaminhar o pedido ao Anderson, que o traz à
conversa e dá aprovação expressa antes de atualizar o catálogo. O pedido pode ser
copiado ou baixado. Não tratar a preparação do pedido como envio ou aprovação.

Referências:
- https://developers.cloudflare.com/pages/functions/bindings/
- https://developers.cloudflare.com/workers/runtime-apis/web-crypto/
- https://developers.cloudflare.com/d1/
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API

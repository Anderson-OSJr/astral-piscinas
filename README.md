# Astral Energia Solar e Piscinas — site + catálogo + captação de leads

Site institucional da **Astral — Solar | Piscinas | Lazer** (Araraquara e São Carlos), com catálogo, calculadoras,
captação de orçamentos e um painel administrativo simples para a equipe da loja.

**Stack:** Next.js 16 (App Router, Server Components, Server Actions) · TypeScript strict · Tailwind CSS 4 + shadcn/ui ·
Prisma 7 + PostgreSQL · Zod · Auth.js v5 · react-hook-form · Embla · motion.

---

## Rodando localmente

Pré-requisitos: **Node 20+** e **Docker** (ou qualquer PostgreSQL 15+).

```bash
# 1. Dependências
npm install

# 2. Variáveis de ambiente
cp .env.example .env        # depois edite AUTH_SECRET e ADMIN_PASSWORD

# 3. Banco (Postgres em localhost:5433, usuário/senha/banco "astral")
docker compose up -d

# 4. Tabelas + dados iniciais (lojas, produtos, posts, admin…)
npm run db:migrate
npm run db:seed

# 5. Servidor de desenvolvimento
npm run dev                 # http://localhost:3000
```

> **Sem Docker?** Opção rápida: `npm run db:local` sobe o Postgres embutido do Prisma (`prisma dev`) e mostra a
> `DATABASE_URL`. Ele aceita poucas conexões simultâneas — use `DATABASE_POOL_MAX=1` no `.env` e prefira Docker ou um
> Postgres de verdade para rodar `npm run build`.

### Painel administrativo

Acesse **http://localhost:3000/admin** com o `ADMIN_EMAIL` / `ADMIN_PASSWORD` definidos no `.env` (o seed cria o
usuário; rodar o seed de novo redefine a senha para a do `.env`).

No painel dá para:

- ver e responder **pedidos de orçamento** (botão de WhatsApp com mensagem pronta), mudar status, anotar e **exportar CSV**;
- editar **produtos, categorias, serviços, lojas e horários, depoimentos, projetos, faixa de campanha, dicas (blog) e FAQs**;
- ajustar **textos da home, parâmetros das calculadoras, redes sociais, nota do Google e vitrine do Instagram**;
- enviar fotos (até 5 MB; JPG, PNG, WEBP ou AVIF).

Toda alteração salva atualiza o site na hora (`revalidatePath`).

### Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` / `npm start` | build e servidor de produção |
| `npm run lint` / `npm run typecheck` | ESLint e TypeScript |
| `npm run db:migrate` | cria/aplica migrações (desenvolvimento) |
| `npm run db:deploy` | aplica migrações (produção) |
| `npm run db:seed` | popula o banco com os dados da Astral |
| `npm run db:studio` | Prisma Studio (visualizar o banco) |
| `npm run db:local` | Postgres embutido do Prisma (alternativa ao Docker) |

---

## Deploy (Vercel + Postgres gerenciado)

1. Crie um banco Postgres no **Neon** ou **Supabase** e copie a connection string (com `sslmode=require`).
2. Importe o repositório na **Vercel** e configure as variáveis:
   `DATABASE_URL`, `AUTH_SECRET` (gere com `npx auth secret`), `NEXT_PUBLIC_SITE_URL=https://astralsolarepiscinas.com.br`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
3. Aplique as migrações e o seed uma vez, a partir da sua máquina apontando para o banco de produção:
   ```bash
   DATABASE_URL="postgres://..." npm run db:deploy
   DATABASE_URL="postgres://..." npm run db:seed
   ```
4. Faça o deploy. O build gera as páginas estáticas a partir do banco (ISR de 1 h + revalidação imediata pelo painel).
5. **Uploads de imagem:** em produção na Vercel o disco é somente leitura. Implemente a interface `StorageProvider`
   em `src/lib/storage.ts` com **Vercel Blob**, S3 ou Cloudinary (≈ 20 linhas) e adicione o host em
   `images.remotePatterns` no `next.config.ts`. Até lá, o painel aceita colar o link de uma imagem já hospedada.
6. Aponte o domínio e cadastre o site no Google Search Console (o `sitemap.xml` é gerado automaticamente).

---

## Arquitetura

```
src/
  app/
    (site)/          páginas públicas (layout com header, footer, WhatsApp, faixa de campanha)
    admin/           painel: login + (panel)/ com sidebar, dashboard, leads, CRUD genérico e configurações
    api/auth/        Auth.js  ·  api/og/  imagens de compartilhamento dinâmicas
    sitemap.ts, robots.ts, manifest.ts, icon.svg
  components/
    ui/              shadcn/ui
    site/ home/ stores/ calculators/ forms/ admin/
  lib/               env (Zod), db, auth, calculators, whatsapp, seo, geo, weather, hours, storage, rate-limit
    validations/     schemas Zod compartilhados (cliente + servidor)
    admin/           configuração das telas de CRUD
  server/
    actions/         Server Actions (leads, admin)
    queries/         leitura do banco
    admin/           repositório tipado por entidade
prisma/              schema, migrações, seed
```

Decisões importantes:

- **Cache:** modelo clássico (ISR + `revalidatePath`) em vez de Cache Components — o conteúdo só muda quando alguém
  salva no painel, e cada Server Action revalida o site inteiro. Simples de entender e manter.
- **Animações de entrada e parallax em CSS puro** (`animation-timeline: view()/scroll()`), sem JavaScript no cliente;
  `motion` fica só nos wizards. Tudo respeita `prefers-reduced-motion`.
- **Calculadoras** em `src/lib/calculators.ts`, com as fórmulas documentadas; parâmetros editáveis no painel.
- **Termômetro ao vivo:** Open-Meteo (sem chave) chamado no servidor com cache de 30 min e fallback.
- **Anti-spam:** honeypot + rate limit por IP (em memória — troque por Redis/Upstash se rodar em várias instâncias).
- **Leads** guardam a página de origem, UTMs, dados da calculadora/wizard e o consentimento LGPD.

## Desempenho e acessibilidade

Medição local com Lighthouse 12 (mobile, build de produção, `localhost`):

| Página | Perf. | Acess. | Boas práticas | SEO |
|---|---|---|---|---|
| Home | 82 | 100 | 100 | 100 |
| Aquecimento solar | 83 | 95→100* | 100 | 100 |
| Produto | 85 | 100 | 100 | 100 |
| Loja (Vila Xavier) | 83 | 98→100* | 100 | 100 |
| Dica (artigo) | 87 | 100 | 100 | 100 |

\* itens corrigidos depois da medição (ordem de títulos).

A meta de **Performance ≥ 95 ainda não foi atingida** no teste local: o LCP simulado fica em ~4 s por causa do custo de
hidratação do React sob CPU 4× mais lenta (sem throttling a página carrega em ~170 ms). Próximos passos sugeridos estão no
`CHECKLIST_CLIENTE.md` (seção técnica). Rode você mesmo:

```bash
npm run build && npm start
npx lighthouse http://localhost:3000 --preset=perf --form-factor=mobile --view
```

Ou use o PageSpeed Insights depois do deploy (números de produção com CDN costumam ser melhores que os locais).

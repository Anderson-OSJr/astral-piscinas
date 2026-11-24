# Checklist para confirmar com o João (Astral)

Itens marcados no código com `TODO` / `[CONFIRMAR]`. Tudo pode ser ajustado pelo **painel** (`/admin`), sem programador,
exceto onde indicado.

## Lojas e contato

- [ ] **Horários das 4 lojas.** Hoje: Loja 1 fecha às 18h (seg–sex); abertura, sábado e demais lojas estão como
      “08:00–18:00, seg–sex” provisório. → *Painel → Lojas e horários*
- [ ] **WhatsApp das lojas 2, 3 e 4** funcionam nos números fixos (WhatsApp Business)?
      Loja 2: (16) 3322-5228 · Loja 3: (16) 3503-1752 · Loja 4: (16) 3307-5459
- [ ] **Coordenadas exatas** das 4 lojas (usadas no “loja mais perto” e no Google). As atuais são aproximadas.
      → no Google Maps, botão direito sobre a loja → copiar os números
- [ ] **CEP** das lojas 2, 3 e 4.
- [ ] **CNPJ** e razão social para o rodapé e a política de privacidade. *(código: `src/lib/site.ts`)*
- [ ] Link direto das **avaliações do Google** da Loja 1 (hoje é uma busca). → *Configurações → Redes sociais*

## Conteúdo

- [ ] **Textos originais dos depoimentos** de Adriana Galhardo, Roger Michetti (Grupo Investe) e Tatiana Castro —
      os atuais são resumos fiéis ao sentido. → *Painel → Depoimentos*
- [ ] **Fotos reais**: obras de piscinas, instalações solares, fachadas das lojas, equipe. Todas as fotos atuais são
      de banco de imagens (Unsplash), trocáveis no painel.
- [ ] **Foto do Joãozinho** para a linha do tempo (home e página Sobre). *(código: `TimelineMini` e `/sobre`)*
- [ ] **Marcas parceiras**: o site atual tem 17 logos sem nome. Quais marcas podemos citar? (não inventamos nenhuma)
- [ ] Produtos: revisar descrições e ficha técnica; incluir modelos reais e potências (ex.: placa de quantos W?).
- [ ] Confirmar se a Astral **faz a homologação** do sistema fotovoltaico junto à distribuidora (texto da página Energia solar).
- [ ] Cidades atendidas além de Araraquara, São Carlos, Américo Brasiliense e Matão.
- [ ] Fotos e links dos 6 posts da **vitrine do Instagram**. → *Configurações → Vitrine do Instagram*

## Parâmetros das calculadoras (estimativas)

→ *Painel → Configurações → Calculadoras*

- [ ] Preço do **kWh** com impostos (CPFL) — padrão R$ 0,95
- [ ] Preço do **gás GLP** por kg — padrão R$ 8,50
- [ ] **Custo médio por kWp** instalado (usado no payback do fotovoltaico) — padrão R$ 3.800
- [ ] Potência e área da **placa fotovoltaica** vendida — padrão 580 W / 2,6 m²
- [ ] Regra de dimensionamento de **coletores para piscina** — padrão 0,8 m² de coletor por m² de piscina, coletor de 2 m²

Todas as telas exibem “Estimativa — faça um orçamento para valores reais.”

## Jurídico

- [ ] Revisar a **Política de Privacidade** (LGPD) com o contador/advogado da empresa.
- [ ] Definir quem recebe os pedidos de orçamento e quem terá acesso ao painel (criar usuários extras).

## Técnico (antes de publicar)

- [ ] Banco Postgres de produção (Neon/Supabase) e deploy na Vercel — passo a passo no `README.md`.
- [ ] **Armazenamento de fotos em produção** (Vercel Blob/S3/Cloudinary) — o envio local só funciona em desenvolvimento.
- [ ] Trocar `ADMIN_PASSWORD` e gerar um `AUTH_SECRET` novo para produção.
- [ ] Apontar o domínio **astralsolarepiscinas.com.br** e enviar o sitemap ao Google Search Console.
- [ ] Criar/atualizar o **Perfil da Empresa no Google** das 4 lojas com o novo site.
- [ ] Desempenho: Lighthouse mobile local ficou em 82–87 (meta 95). Próximos passos: medir no PageSpeed depois do deploy;
      se precisar, carregar carrosséis e o localizador de lojas só quando entram na tela e reduzir componentes Radix no header.

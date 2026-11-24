import type { Metadata } from "next";
import { Breadcrumbs, Markdown } from "@/components/site/page-blocks";
import { pageMetadata } from "@/lib/seo";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Política de Privacidade",
  description: "Como a Astral Energia Solar e Piscinas coleta, usa e protege os seus dados pessoais, conforme a LGPD.",
  path: "/politica-de-privacidade",
});

// TODO: revisar com o jurídico do cliente e preencher razão social/CNPJ.
const CONTENT = `
Esta política explica como a **${BRAND.searchName}** ("Astral", "nós") trata os dados pessoais de quem visita o site **${BRAND.domain}**, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).

## 1. Quem é o controlador dos dados

${BRAND.searchName} — CNPJ ${BRAND.cnpj}. Contato: [${BRAND.emails.araraquara}](mailto:${BRAND.emails.araraquara}).

## 2. Quais dados coletamos

- **Dados que você informa** nos formulários de orçamento, visita técnica e "Monte sua piscina": nome, telefone/WhatsApp, e-mail (opcional), cidade/bairro (opcional), loja de preferência e a mensagem que você escrever.
- **Dados das calculadoras**, quando você decide enviá-los junto com o pedido (ex.: número de moradores, valor da conta de luz, medidas da piscina).
- **Dados de navegação**: página de origem do pedido e parâmetros de campanha (UTM), usados para entender quais canais trazem clientes.
- **Localização aproximada**, apenas se você clicar em "Usar minha localização" e autorizar no navegador. Ela é usada só no seu aparelho para calcular a loja mais perto e **não é enviada nem armazenada** pela Astral.

## 3. Para que usamos

- Responder o seu pedido de orçamento ou visita técnica;
- Entrar em contato pelo telefone ou WhatsApp informado;
- Melhorar o atendimento e o site.

A base legal é o seu **consentimento**, registrado no momento do envio do formulário, e a execução de procedimentos preliminares a um contrato a seu pedido.

## 4. Com quem compartilhamos

Os dados ficam restritos à equipe da Astral. Usamos fornecedores de tecnologia (hospedagem e banco de dados) que tratam os dados apenas para operar o site. **Não vendemos dados pessoais.**

Ao clicar em links do WhatsApp, Instagram, Facebook ou Google Maps, você passa a usar os serviços dessas empresas, sujeitos às políticas delas.

## 5. Por quanto tempo guardamos

Pelo tempo necessário para o atendimento e eventual relação comercial, ou até você pedir a exclusão, respeitadas obrigações legais.

## 6. Seus direitos

Você pode pedir a qualquer momento: confirmação e acesso aos seus dados, correção, anonimização, portabilidade, exclusão e revogação do consentimento. Basta escrever para [${BRAND.emails.araraquara}](mailto:${BRAND.emails.araraquara}).

## 7. Segurança

Adotamos medidas técnicas e administrativas para proteger os dados, como conexão criptografada (HTTPS), acesso restrito ao painel administrativo e senhas protegidas.

## 8. Cookies

O site usa apenas armazenamento técnico essencial (por exemplo, para lembrar que você fechou um aviso ou para manter a sessão do painel administrativo). Não usamos cookies de publicidade.

## 9. Alterações

Esta política pode ser atualizada. A versão vigente estará sempre nesta página.

*Última atualização: novembro de 2026.*
`;

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-10 sm:py-16">
      <Breadcrumbs tone="light" items={[{ name: "Política de privacidade", path: "/politica-de-privacidade" }]} />
      <h1 className="mt-8 text-4xl font-extrabold text-ocean-900 sm:text-5xl">Política de privacidade</h1>
      <div className="mt-8">
        <Markdown content={CONTENT} />
      </div>
    </div>
  );
}

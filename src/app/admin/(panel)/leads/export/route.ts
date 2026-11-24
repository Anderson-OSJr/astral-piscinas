import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { leadFiltersSchema, leadWhere } from "@/server/queries/leads";
import { INTEREST_LABELS, STATUS_LABELS } from "@/lib/site";

function csvCell(value: unknown) {
  let s = value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  // Evita que o Excel interprete o conteúdo como fórmula
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const filters = leadFiltersSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
  const leads = await db.lead.findMany({
    where: leadWhere(filters),
    orderBy: { createdAt: "desc" },
    include: { store: { select: { name: true } } },
    take: 10000,
  });

  const header = ["Data", "Nome", "Telefone", "E-mail", "Cidade", "Loja", "Interesse", "Status", "Mensagem", "Detalhes", "Página", "UTM", "Anotações"];
  const lines = leads.map((l) =>
    [
      l.createdAt.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      l.name,
      l.phone,
      l.email,
      l.city,
      l.store?.name,
      INTEREST_LABELS[l.interest],
      STATUS_LABELS[l.status],
      l.message,
      l.payload,
      l.sourcePage,
      l.utm,
      l.notes,
    ]
      .map(csvCell)
      .join(";"),
  );
  // BOM para o Excel abrir com acentos corretos; ";" é o separador padrão no Excel em português
  const body = "﻿" + [header.map(csvCell).join(";"), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-astral-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

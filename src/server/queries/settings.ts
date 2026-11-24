import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { SETTINGS, settingEmptyInput, type SettingKey, type SettingValue } from "@/lib/settings-schema";

/** Lê uma configuração do banco e aplica os padrões do schema (nunca quebra o site). */
export const getSetting = cache(async <K extends SettingKey>(key: K): Promise<SettingValue<K>> => {
  const row = await db.siteSetting.findUnique({ where: { key } });
  const schema = SETTINGS[key];
  const parsed = schema.safeParse(row?.value ?? settingEmptyInput(key));
  if (parsed.success) return parsed.data as SettingValue<K>;
  return schema.parse(settingEmptyInput(key)) as SettingValue<K>;
});

import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import DatumVerschil from "@/components/reken/DatumVerschil";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, sleutel, ymd } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export const metadata = IS_EN
  ? {}
  : {
      title: "Dagen tussen twee datums berekenen: dagen, weken en werkdagen",
      description:
        "Bereken hoeveel dagen er tussen twee datums zitten, met weken, maanden en werkdagen erbij. Kies of de einddatum meetelt. Gratis en direct in je browser.",
      alternates: { canonical: "/dagen-tussen-twee-datums" },
    };

export default function DagenTussenPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  return (
    <RekenPagina id="dagen-tussen">
      <DatumVerschil van={sleutel(nu)} tot={sleutel(ymd(nu.j, 12, 31))} />
    </RekenPagina>
  );
}

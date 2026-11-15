import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import HittegolfVooruitblik from "@/components/reken/HittegolfVooruitblik";
import { IS_EN } from "@/lib/i18n/locale";

export const metadata = IS_EN
  ? {}
  : {
      title: "Komt er een hittegolf? De verwachting getoetst aan de KNMI-definitie",
      description:
        "Komt er een hittegolf in Nederland? De verwachting voor De Bilt de komende week, getoetst aan de definitie: vijf zomerse dagen op rij, waarvan drie tropisch.",
      alternates: { canonical: "/komt-er-een-hittegolf" },
    };

export default function HittegolfPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="hittegolf">
      <HittegolfVooruitblik />
    </RekenPagina>
  );
}

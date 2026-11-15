import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import Verjaardag from "@/components/reken/Verjaardag";
import { IS_EN } from "@/lib/i18n/locale";

export const metadata = IS_EN
  ? {}
  : {
      title: "Hoeveel dagen tot mijn verjaardag? Tel af naar je volgende verjaardag",
      description:
        "Vul je geboortedatum in en zie hoeveel dagen het nog is tot je verjaardag, op welke dag die valt en hoe oud je wordt. Niets wordt opgeslagen.",
      alternates: { canonical: "/hoeveel-dagen-tot-mijn-verjaardag" },
    };

export default function VerjaardagPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="verjaardag">
      <Verjaardag />
    </RekenPagina>
  );
}

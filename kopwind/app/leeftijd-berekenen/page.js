import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import Leeftijd from "@/components/reken/Leeftijd";
import { IS_EN } from "@/lib/i18n/locale";

export const metadata = IS_EN
  ? {}
  : {
      title: "Leeftijd berekenen: hoe oud ben ik in jaren, maanden en dagen?",
      description:
        "Bereken een leeftijd precies in jaren, maanden en dagen, plus het totaal aantal dagen en weken. Ook op een zelfgekozen peildatum. Niets wordt opgeslagen.",
      alternates: { canonical: "/leeftijd-berekenen" },
    };

export default function LeeftijdPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="leeftijd">
      <Leeftijd />
    </RekenPagina>
  );
}

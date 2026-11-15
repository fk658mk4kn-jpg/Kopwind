import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import OnweerCheck from "@/components/reken/OnweerCheck";
import { IS_EN } from "@/lib/i18n/locale";

export const metadata = IS_EN
  ? {}
  : {
      title: "Gaat het vandaag onweren? Onweer per uur voor jouw plek",
      description:
        "Gaat het onweren vandaag of morgen? Per dag de uren met onweer in de verwachting, kans op hagel en de energie in de lucht, plus wat je doet als het onweert.",
      alternates: { canonical: "/gaat-het-onweren" },
    };

export default function OnweerPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="onweer">
      <OnweerCheck />
    </RekenPagina>
  );
}

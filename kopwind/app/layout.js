import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata = {
  title: "Kopwind: fiets of scooter?",
  description:
    "Multi-stop fietsplanner die per routesegment de kopwind berekent en adviseert: fiets prima, fiets met tegenzin, of pak de scooter.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}

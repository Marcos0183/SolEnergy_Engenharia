import "./globals.css";

export const metadata = {
  title: "SolarTech - Gerenciamento de Clientes",
  description:
    "Sistema web para gerenciamento de clientes de energia solar fotovoltaica.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

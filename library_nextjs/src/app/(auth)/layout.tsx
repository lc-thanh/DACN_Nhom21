import { ModeToggle } from "@/components/mode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <h1>Auth Layouts</h1>
      <ModeToggle />
      {children}
    </section>
  );
}

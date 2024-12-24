import { ModeToggle } from "@/components/mode-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <ModeToggle />
      {children}
    </section>
  );
}

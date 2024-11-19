import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <ul>
      <li>
        <Link href="/login">Login</Link>
      </li>
      <li>
        <Link href="/signup">Sign up</Link>
      </li>
      <li>
        <ModeToggle />
      </li>
    </ul>
  );
}

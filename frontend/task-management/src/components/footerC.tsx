import Link from "next/link";
export default function Footer() {
  return (<footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            The source code is available on{" "}
            <Link
              href="https://github.com/nour-mezzi/Task-Management-WA.git"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
            GitHub
            </Link>
        </div>
      </footer>);
}
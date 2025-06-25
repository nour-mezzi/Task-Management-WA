import { KanbanBoard } from "@/components/board";
import "../globals.css";
import Header from "@/components/header";

import  Footer from "@/components/footerC";

export default function Home() {
  return (
    <div><Header />
     <KanbanBoard />
     <Footer />  </div>
  );
}

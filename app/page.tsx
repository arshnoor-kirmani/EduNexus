import Header from "@/components/Custom/Utils/Header";
import Section from "@/components/Custom/Utils/Section";
import Footer from "@/components/Custom/Utils/Footer";
export default function Home() {
  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      {/* <div> */}
      <Header />
      {/* </div> */}
      <main>
        <Section />
      </main>
      <Footer />
    </div>
  );
}

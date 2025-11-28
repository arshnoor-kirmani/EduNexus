import Header from "@/components/custom/utils/Header";
import Section from "@/components/custom/utils/Section";
import Footer from "@/components/custom/utils/Footer";
export default function Home() {
  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden">
      {/* <div> */}
      <Header />
      {/* </div> */}
      <main className="flex-1 mt-15">
        <Section />
      </main>
      <Footer />
    </div>
  );
}

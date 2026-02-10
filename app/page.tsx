import Hero from '@/components/Hero';
import About from '@/components/About';
import Masters from '@/components/Masters';
import Gallery from '@/components/Gallery';
import Classes from '@/components/Classes';
import Schedule from '@/components/Schedule';
import Tournaments from '@/components/Tournaments';
import Ceremonies from '@/components/Ceremonies';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <About />
            <Classes />
      <Masters />
      <Gallery />

      <Schedule />
      <Tournaments />
      <Ceremonies />
      <Contact />
    </main>
  );
}

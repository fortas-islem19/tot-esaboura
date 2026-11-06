import { Approach, Audience, Certification, Faq, Footer, Header, Hero, Journey, Kit, MobileBar, Outcomes, Pricing, Program, Stats, Trainers, Why } from './components/Sections'
import RegisterForm from './components/RegisterForm'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Why />
        <Outcomes />
        <Approach />
        <Journey />
        <Program />
        <Trainers />
        <Certification />
        <Kit />
        <Audience />
        <Pricing />
        <Faq />
        <RegisterForm />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}

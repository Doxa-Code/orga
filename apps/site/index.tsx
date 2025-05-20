import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  BarChart2,
  Briefcase,
  Building,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  PieChart,
  Shield,
  ShoppingBag,
  Truck,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const areas = [
  {
    title: "Controle Financeiro",
    description: "Gerencie suas finanças com precisão e facilidade.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Gestão de Projetos",
    description:
      "Acompanhe o progresso e os custos de seus projetos em tempo real.",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    title: "Análise de Dados",
    description:
      "Tome decisões informadas com base em relatórios detalhados e insights valiosos.",
    image: "/placeholder.svg?height=400&width=600",
  },
];

const segments = [
  {
    icon: Building,
    title: "Construção Civil",
    description:
      "Gerencie projetos e custos com precisão, mantendo o controle financeiro de obras e empreendimentos.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: ShoppingBag,
    title: "Comércio Varejista",
    description:
      "Controle estoque, vendas e finanças em uma única plataforma, otimizando a gestão do seu negócio.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: Truck,
    title: "Logística e Transporte",
    description:
      "Acompanhe custos operacionais, faturamento e lucratividade de cada rota ou veículo.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: Utensils,
    title: "Restaurantes e Bares",
    description:
      "Gerencie estoques, custos de ingredientes e rentabilidade de cada prato ou bebida.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: Briefcase,
    title: "Prestadores de Serviços",
    description:
      "Controle projetos, horas trabalhadas e faturamento de forma eficiente e precisa.",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    icon: Zap,
    title: "Software",
    description:
      "Gerencie o desenvolvimento, licenciamento e suporte de produtos de software.",
    image: "/placeholder.svg?height=200&width=300",
  },
];

export default function Component() {
  const [email, setEmail] = useState("");
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSegment((prev) => (prev + 1) % segments.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSegment = () => {
    setCurrentSegment((prev) => (prev + 1) % segments.length);
  };

  const prevSegment = () => {
    setCurrentSegment((prev) => (prev - 1 + segments.length) % segments.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="px-4 lg:px-6 h-20 flex items-center bg-white bg-opacity-90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <a className="flex items-center justify-center" href="#">
          <span className="text-2xl font-bold">
            Budget<span className="text-green-500">S</span>aas
          </span>
        </a>
        <nav className="ml-auto flex gap-6 sm:gap-8">
          {[
            "Recursos",
            "Simplicidade",
            "Áreas",
            "Planos",
            "Depoimentos",
            "Contato",
          ].map((item) => (
            <a
              key={item}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              href={`#${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
              <div className="space-y-4 max-w-3xl md:w-1/2">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                  Controle seu negócio e ganhe tempo com o orga
                </h1>
                <p className="mx-auto max-w-[700px] text-xl text-blue-100 md:text-2xl">
                  ERP financeiro simples, seguro e de fácil implantação.
                  Automatize suas rotinas e tome as melhores decisões.
                </p>
                <div className="w-full max-w-md space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (agreePolicy) {
                        console.log("Formulário enviado com:", email);
                      } else {
                        alert(
                          "Por favor, concorde com a Política de Privacidade."
                        );
                      }
                    }}
                    className="space-y-4"
                  >
                    <Input
                      type="email"
                      placeholder="Seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-white bg-opacity-80 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      type="submit"
                      className="w-full h-12 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold transition-colors duration-300"
                    >
                      Experimente Grátis
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="policy"
                        checked={agreePolicy}
                        onCheckedChange={(checked) =>
                          setAgreePolicy(checked as boolean)
                        }
                        className="border-white"
                      />
                      <label
                        htmlFor="policy"
                        className="text-sm font-medium leading-none text-blue-100 hover:text-white transition-colors"
                      >
                        Concordo com a Política de Privacidade
                      </label>
                    </div>
                  </form>
                </div>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Pessoa feliz usando computador"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="recursos" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">
              Recursos Principais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: BarChart2,
                  title: "Controle Financeiro",
                  description:
                    "Gerencie contas, fluxo de caixa e conciliação bancária com facilidade.",
                },
                {
                  icon: PieChart,
                  title: "Relatórios Detalhados",
                  description:
                    "Obtenha insights valiosos com relatórios financeiros personalizáveis em tempo real.",
                },
                {
                  icon: Users,
                  title: "Gestão de Clientes",
                  description:
                    "Mantenha um registro completo de seus clientes e fornecedores em um só lugar.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="mb-6 p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors duration-300">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="simplicidade" className="w-full py-20 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">
              Simples e Eficaz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Fácil de Usar",
                  description:
                    "Interface intuitiva que não requer conhecimentos técnicos avançados.",
                },
                {
                  icon: Clock,
                  title: "Rápida Implementação",
                  description:
                    "Comece a usar em minutos, sem necessidade de longas configurações.",
                },
                {
                  icon: Shield,
                  title: "Seguro e Confiável",
                  description:
                    "Seus dados estão protegidos com as mais avançadas tecnologias de segurança.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4 p-3 bg-blue-100 rounded-full">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="áreas" className="w-full py-20 md:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">
              Áreas que Podemos Ajudar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areas.map((area, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {area.title}
                    </h3>
                    <p className="text-gray-600">{area.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="segmentos" className="w-full py-20 md:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">
              Segmentos de Atuação
            </h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSegment * 100}%)` }}
                >
                  {segments.map((segment, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-blue-50 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
                        <img
                          src={segment.image}
                          alt={segment.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <segment.icon className="h-6 w-6 text-blue-600 mr-2" />
                            <h3 className="text-xl font-bold text-gray-900">
                              {segment.title}
                            </h3>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {segment.description}
                          </p>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300">
                            Saiba Mais
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={prevSegment}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
                aria-label="Segmento anterior"
              >
                <ChevronLeft className="h-6 w-6 text-blue-600" />
              </button>
              <button
                onClick={nextSegment}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
                aria-label="Próximo segmento"
              >
                <ChevronRight className="h-6 w-6 text-blue-600" />
              </button>
            </div>
          </div>
        </section>

        <section id="planos" className="w-full py-20 md:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">
              Planos que Cabem no seu Bolso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Básico",
                  price: "R$49",
                  features: [
                    "Controle financeiro básico",
                    "Relatórios mensais",
                    "Suporte por email",
                  ],
                },
                {
                  name: "Profissional",
                  price: "R$99",
                  features: [
                    "Controle financeiro avançado",
                    "Relatórios personalizados",
                    "Suporte prioritário",
                  ],
                },
                {
                  name: "Empresarial",
                  price: "R$199",
                  features: [
                    "Recursos ilimitados",
                    "API para integrações",
                    "Suporte 24/7",
                  ],
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`flex flex-col p-8 bg-white rounded-2xl shadow-lg ${
                    index === 1 ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold mb-6 text-blue-600">
                    {plan.price}
                    <span className="text-base font-normal text-gray-600">
                      /mês
                    </span>
                  </p>
                  <ul className="mb-8 space-y-4 flex-grow">
                    {plan.features.map((feature, fIndex) => (
                      <li
                        key={fIndex}
                        className="flex items-center text-gray-600"
                      >
                        <ChevronRight className="h-5 w-5 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`mt-auto ${
                      index === 1
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    } transition-colors duration-300`}
                  >
                    Escolher Plano
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="w-full py-20 md:py-32 bg-blue-50">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-center mb-12 text-gray-900">
              O que Nossos Clientes Dizem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "João Silva",
                  role: "Proprietário de Pequena Empresa",
                  content:
                    "O orga revolucionou a forma como gerencio minhas finanças. É simples e eficaz!",
                },
                {
                  name: "Maria Santos",
                  role: "Contadora",
                  content:
                    "Com o orga, economizo horas de trabalho todos os dias. É uma ferramenta indispensável.",
                },
                {
                  name: "Carlos Oliveira",
                  role: "Empreendedor",
                  content:
                    "Os relatórios detalhados me ajudam a tomar decisões melhores para o meu negócio. Recomendo!",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-blue-600 font-bold">
                        {testimonial.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="w-full py-20 md:py-32 bg-blue-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-white">
                Pronto para Começar?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Simplifique suas finanças e impulsione seu negócio com o orga.
              </p>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg font-semibold py-3 px-8 rounded-full transition-colors duration-300">
                Comece seu Teste Grátis
              </Button>
            </div>
          </div>
        </section>

        <section
          id="fale-conosco"
          className="w-full py-20 md:py-32 bg-gray-100"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 text-gray-900">
                Tem dúvidas de como o orga pode ajudar o seu negócio?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Fale com nosso time de especialistas e tire todas as suas
                dúvidas
              </p>
              <Button className="bg-green-500 text-white hover:bg-green-600 text-lg font-semibold py-3 px-8 rounded-full transition-colors duration-300 flex items-center justify-center">
                <Phone className="mr-2 h-5 w-5" />
                Falar com um especialista
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-8 bg-gray-900 text-white">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="text-xl font-bold">
              Budget<span className="text-green-500">S</span>aas
            </span>
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <a
              className="text-sm hover:text-blue-400 transition-colors"
              href="#"
            >
              Termos de Serviço
            </a>
            <a
              className="text-sm hover:text-blue-400 transition-colors"
              href="#"
            >
              Política de Privacidade
            </a>
          </nav>
        </div>
      </footer>

      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50 animate-pulse"
        style={{ animationDuration: "3s" }}
        aria-label="Iniciar conversa no WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-6 w-6 fill-current"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        <span className="sr-only">Iniciar conversa no WhatsApp</span>
      </a>
    </div>
  );
}

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-base-200 px-5 md:px-0 font-sans">
      <div className="container mx-auto">
        <div className="flex justify-between py-16">
          <div className="max-w-[700px]">
            <p className="mt-3 text-base text-base-content/70 mb-6">
              Nosso ERP financeiro foi desenvolvido para simplificar a gestão do
              seu negócio. Com uma plataforma intuitiva e automatizada, você não
              precisa mais perder tempo se preocupando com finanças. Deixe o
              controle financeiro conosco, enquanto você foca no que realmente
              importa: conquistar mais clientes e otimizar seu crescimento. Com
              o nosso sistema, a gestão financeira se torna rápida e eficiente,
              permitindo que seu dia seja mais produtivo e estratégico.
            </p>
            <div>
              <Link
                href="mailto:contato@orga.com.br"
                className="font-semibold text-base-content text-base"
              >
                Email :{" "}
                <span className="text-base-content/70 font-normal hover:text-primary hover:duration-300 transition">
                  contato@orgar
                </span>
              </Link>
            </div>
            <div className="mt-1">
              <Link
                href="https://wa.me/5519920008201"
                className="font-semibold text-base-content text-base"
              >
                Whatsapp :{" "}
                <span className="text-base-content/70 font-normal hover:text-primary hover:duration-300 transition">
                  55 19 9 2000 8201
                </span>
              </Link>
            </div>
          </div>

          {/* <NewsLetter /> */}
        </div>
        <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between py-4 bg-base-200 border-t border-base-content/10">
          <p className="mt-0.5 text-base-content/70 text-base">
            © 2024 Budget Saas. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

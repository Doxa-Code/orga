import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const Header = () => {
  return (
    <header className="py-5">
      <div className="container mx-auto font-work">
        <div className="navbar flex justify-between">
          <Link className="flex w-full" href="/">
            <div className="flex flex-col">
              <span className="font-light text-gray-400 leading-3">Blog</span>
              <div className="flex">
                <h1
                  className={`${poppins.className} font-bold text-3xl text-primary`}
                >
                  Budget
                </h1>
                <h1
                  className={`${poppins.className} font-bold text-3xl text-secondary`}
                >
                  Saas
                </h1>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Header;

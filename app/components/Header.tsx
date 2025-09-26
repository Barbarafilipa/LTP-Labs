import { Link } from "@remix-run/react";
import { ShoppingBag, User, Search } from "lucide-react";

export default function Header() {
    return (
        <header className="bg-white">
          <div className="mx-auto px-8 py-3 flex justify-between items-center">
            <h1 className="flex-1 font-semibold text-[32px] sm:text-[24px]">
              THE ONLINE STORE
            </h1>
            <nav className="flex-1 space-x-[32px] justify-center flex items-center">
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                Home
              </Link>
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                Shop
              </Link>
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                About
              </Link>
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                Contact
              </Link>
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                Blog
              </Link>
            </nav>
            <nav className="flex-1 space-x-[24px] justify-end flex items-center">
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                <Search size={20} />
              </Link>
              <Link to="/" className="text-[15px] hover:text-midnight-200">
                <User size={20} />
              </Link>
              <Link to="/cart" className="text-[15px] hover:text-midnight-200">
                <ShoppingBag size={20} />
              </Link>
            </nav>
          </div>
          <hr className="border-t border-gray-300" />
        </header>
    );
}

import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-inner mt-0">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h3 className="text-xl font-bold text-pink-500 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-purple-700">
            <li>
              <Link href="/" className="hover:text-pink-500 transition-colors duration-200">Home</Link>
            </li>
            <li>
              <Link href="/admission" className="hover:text-pink-500 transition-colors duration-200">Admission</Link>
            </li>
            <li>
              <Link href="/payment" className="hover:text-pink-500 transition-colors duration-200">Payment</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-pink-500 transition-colors duration-200">Contact</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold text-pink-500 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-purple-700">
            <li className="flex items-center gap-2 hover:text-pink-500 transition-colors duration-200">
              <Phone size={18} />
              <a href="tel:+916206895209">+91 6206895209</a>
            </li>
            <li className="flex items-center gap-2 hover:text-pink-500 transition-colors duration-200">
              <Mail size={18} />
              <a href="mailto:sanjeevnipathshala@gmail.com">sanjeevnipathshala@gmail.com</a>
            </li>
            <li className="flex items-center gap-2 hover:text-pink-500 transition-colors duration-200">
              <MapPin size={18} />
              <a
                href="https://www.google.com/maps/search/?api=1&query=bks+consultancy+building,Dhanpurva,Sasaram,Rohtas,Bihar"
                target="_blank"
                rel="noopener noreferrer"
              >
                bks consultancy building, Dhanpurva, Sasaram, Rohtas, Bihar
              </a>
            </li>
          </ul>
        </div>

      </div>

      <div className="bg-pink-50 text-purple-700 text-center py-4 mt-6">
        &copy; {new Date().getFullYear()} Sanjeevni Coaching. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50 h-20">
            <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-pink-500">
                    Sanjeevni Coaching
                </Link>
                <ul className="hidden md:flex gap-8 text-lg font-medium text-purple-700">
                    <li>
                        <Link href="/" className="hover:text-pink-500 transition">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/admission" className="hover:text-pink-500 transition">
                            Admission
                        </Link>
                    </li>
                    <li>
                        <Link href="/payment" className="hover:text-pink-500 transition">
                            Payment
                        </Link>
                    </li>
                    <li>
                        <Link href="/contact" className="hover:text-pink-500 transition">
                            Contact
                        </Link>
                    </li>
                </ul>
                <button
                    className="md:hidden text-pink-500 hover:text-pink-600 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>

            </div>
            {isOpen && (
                <div className="md:hidden bg-white shadow-lg px-6 pb-4">
                    <ul className="flex flex-col gap-4 text-lg font-medium text-purple-700">
                        <li>
                            <Link href="/" onClick={() => setIsOpen(false)} className="hover:text-pink-500 transition">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/admission" onClick={() => setIsOpen(false)} className="hover:text-pink-500 transition">
                                Admission
                            </Link>
                        </li>
                        <li>
                            <Link href="/payment" onClick={() => setIsOpen(false)} className="hover:text-pink-500 transition">
                                Payment
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" onClick={() => setIsOpen(false)} className="hover:text-pink-500 transition">
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-3">
              RitualOS
            </h3>
            <p className="text-gray-400 mb-4">
              The micro-ritual operating system for the distracted generation.
              Transform scattered energy into focused intention.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/signup" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-gray-400 hover:text-purple-400 transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-gray-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© 2024 RitualOS. Built for focused minds in a distracted world.</p>
        </div>
      </div>
    </footer>
  )
}


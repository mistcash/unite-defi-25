'use client'

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FloatingIslands from "../components/FloatingCones";
import DepositUI from "../components/TransferUI";
import ClaimUI from "../components/ClaimUI";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'claim'>('deposit');
  return (
    <div className="font-sans min-h-screen scroll-smooth">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-black/20 ">
        <FloatingIslands>
          <div className="text-center max-w-6xl mx-auto px-4 md:px-8 md:pt-16 lg:pt-30 black-shadow text-xl md:text-2xl lg:text-3xl">
            <div className="my-20">
              <Image
                className="mx-auto my-2"
                src="/mist-logo.svg"
                alt="Mist logo"
                width={50}
                height={50}
                priority
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              MIST.cash | FOCBB
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Send <span className="text-blue-400">USDC privately</span><br />
              to any Gmail address<br />
              <span className="text-yellow-400">across chains</span>
            </h1>

            {/* Cool arrow CTA */}
            <div className="flex flex-col items-center my-20">
              <a href="#demo" className="group flex flex-col items-center transition-transform duration-300">
                <span className="text-white text-lg font-medium tracking-wide opacity-90 transition-opacity duration-500 animate-bounce">
                  Try the demo below
                </span>
                <div className="relative">
                  <div className="w-24 h-14 flex items-center justify-center transition-colors duration-300">
                    <svg
                      className="mt-4 w-16 h-16 text-white duration-500 animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {/* Arrowhead (static) */}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 14l-7 7m0 0l-7-7"
                      />
                      {/* Extending line */}
                      <path
                        className="animate-extend-line"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 20V0"
                      />
                    </svg>
                  </div>
                </div>
              </a>

            </div>
          </div>
          {/* Demo Section */}
          <section id="demo" className="max-w-4xl mx-auto acrylic py-20 px-4 md:px-8" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-800 bg-opacity-60 rounded-lg p-1 flex">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'deposit'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  Send Payment
                </button>
                <button
                  onClick={() => setActiveTab('claim')}
                  className={`px-6 py-3 rounded-md font-semibold transition-all ${activeTab === 'claim'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                >
                  Claim Payment
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'deposit' && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                  Send USDC to any Gmail address from Base
                </h2>
                <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                  Send USDC from Base to any Gmail address privately.<br />Recipients can claim on any chain using 1Inch Fusion+.
                </p>
                <div className="flex justify-center">
                  <DepositUI />
                </div>
              </>
            )}

            {activeTab === 'claim' && (
              <>
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
                  Claim your payment with Gmail verification
                </h2>
                <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                  Sign in with your Gmail account to claim payments sent to your email address.<br />Zero-knowledge proofs verify your identity without revealing personal data.
                </p>
                <div className="flex justify-center">
                  <ClaimUI />
                </div>
              </>
            )}
          </section>

        </FloatingIslands>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            How Cross-Chain Private Transfers Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-800 bg-opacity-60 rounded-xl">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Deposit on Base</h3>
              <p className="text-gray-300">
                Send USDC on Base to a Gmail address. The payment is stored privately using a cryptographic hash of the email and a random value.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-800 bg-opacity-60 rounded-xl">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gray-900">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Cross-Chain Storage</h3>
              <p className="text-gray-300">
                Hyperlane transfers the payment data to Starknet, where it&#39;s stored in a Merkle tree for efficient verification.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-800 bg-opacity-60 rounded-xl">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Claim Anywhere</h3>
              <p className="text-gray-300">
                Verify Gmail ownership with JWT, prove membership in the Merkle tree, and claim on any chain via 1Inch Fusion+.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Built on Leading Infrastructure
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl" style={{ background: `linear-gradient(135deg, var(--navy-medium), var(--navy-bright))` }}>
              <h3 className="text-3xl font-bold text-white mb-6">Cross-Chain Architecture</h3>
              <p className="text-lg mb-6" style={{ color: 'var(--navy-pale)' }}>
                Leveraging Hyperlane for seamless cross-chain messaging between Base and Starknet,
                with 1Inch Fusion+ for efficient cross-chain claiming.
              </p>
              <ul className="space-y-3" style={{ color: 'var(--navy-pale)' }}>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  Base network for USDC deposits
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  Starknet for private storage and verification
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  Hyperlane for secure cross-chain messaging
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  1Inch Fusion+ for multi-chain claiming
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl" style={{ background: `linear-gradient(135deg, var(--navy-deep), var(--navy-medium))` }}>
              <h3 className="text-3xl font-bold text-white mb-6">Privacy & Security</h3>
              <p className="text-lg mb-6" style={{ color: 'var(--navy-pale)' }}>
                Zero-knowledge proofs ensure privacy while JWT verification provides secure Gmail-based authentication
                without revealing personal information.
              </p>
              <ul className="space-y-3" style={{ color: 'var(--navy-pale)' }}>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  JWT-based Gmail verification
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  Merkle tree proofs for efficient verification
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  Nullifier system prevents double-spending
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  Cryptographic email hashing for privacy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
            Live Demo Features
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-4xl mx-auto">
            Experience private cross-chain USDC transfers with Gmail-based claiming.
            Built with cutting-edge zero-knowledge technology and cross-chain infrastructure.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Base Network <span className="text-blue-400">●</span>
              </h3>
              <p className="text-gray-300">
                Fast and cheap USDC deposits on Coinbase&#39;s Layer 2 solution
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Gmail Auth <span className="text-yellow-400">●</span>
              </h3>
              <p className="text-gray-300">
                Secure JWT-based verification without revealing personal data
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Starknet Storage <span className="text-blue-400">●</span>
              </h3>
              <p className="text-gray-300">
                Private storage with efficient Merkle tree verification
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                1Inch Fusion+ <span className="text-yellow-400">●</span>
              </h3>
              <p className="text-gray-300">
                Claim your USDC on any supported blockchain network
              </p>
            </div>
          </div>

          <div className="p-8 bg-gray-800 bg-opacity-60 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Technical Implementation</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Deposit Flow</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Generate email_rnd_hash from Gmail + random value</li>
                  <li>• Store USDC amount and token contract on Base</li>
                  <li>• Dispatch to Starknet via Hyperlane messaging</li>
                  <li>• Create Merkle tree entry for efficient verification</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Claim Flow</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Verify JWT token for Gmail authentication</li>
                  <li>• Generate Merkle proof for payment membership</li>
                  <li>• Create nullifier to prevent double-spending</li>
                  <li>• Claim via 1Inch Fusion+ on target network</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-800 bg-opacity-30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Experience Private Cross-Chain Transfers
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Try our live demo to send USDC from Base to any Gmail address,
            then claim it on any supported blockchain network.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Try Demo Above
            </button>
            <Link href="https://github.com/mistcash" target="_blank"
              className="border border-gray-400 text-white hover:bg-gray-700 px-4 md:px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              View on GitHub
            </Link>
            <Link href="https://shhtarknet.github.io/mist/" target="_blank"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 md:px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Previous Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-8 bg-gray-900 bg-opacity-90 border-t border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Image
                src="/mist-logo.svg"
                alt="Mist logo"
                width={180}
                height={36}
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <p className="text-gray-400 mt-2">Private cross-chain USDC transfers via Gmail</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="https://github.com/mistcash" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 MIST Cash. Demonstrating private cross-chain USDC transfers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

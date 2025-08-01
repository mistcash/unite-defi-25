import Image from "next/image";
import Link from "next/link";
import FloatingIslands from "../components/FloatingCones";
import TransferUI from "../components/TransferUI";
import ClaimUI from "../components/ClaimUI.tsx";

export default function Home() {
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
              Send money to anyone<br />
              <span className="text-blue-400">anywhere privately</span><br />
              <span className="text-yellow-400">with compliance</span>
            </h1>

            {/* Cool arrow CTA */}
            <div className="flex flex-col items-center my-20">
              <a href="#demo" className="group flex flex-col items-center transition-transform duration-300">
                <span className="text-white text-lg font-medium tracking-wide opacity-90 transition-opacity duration-500 animate-bounce">
                  Make a private transaction
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
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
              Send money to a Gmail address from Base
            </h2>
            <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
              Privately transaction to a gmail address from Base.<br />Claims are fulfilled on your network of choice with 1Inch Fusion+.
            </p>
            <div className="flex justify-center">
              <TransferUI />
            </div>
          </section>

        </FloatingIslands>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            How Private Payments Work
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-800 bg-opacity-60 rounded-xl">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Sender Creates Payment</h3>
              <p className="text-gray-300">
                Sender generates a payment with a cryptographic secret, ensuring only the intended recipient can claim it.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-800 bg-opacity-60 rounded-xl">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-gray-900">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Zero-Knowledge Proof</h3>
              <p className="text-gray-300">
                Recipient proves knowledge of the secret using zero-knowledge proofs without revealing the secret itself.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-800 bg-opacity-60 rounded-xl">
              <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Claim Funds</h3>
              <p className="text-gray-300">
                Upon successful proof verification, funds are automatically released to the recipient&#39;s wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MIST Products Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            MIST Privacy Solutions
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl" style={{ background: `linear-gradient(135deg, var(--navy-medium), var(--navy-bright))` }}>
              <h3 className="text-3xl font-bold text-white mb-6">1. MIST Ledger</h3>
              <p className="text-lg mb-6" style={{ color: 'var(--navy-pale)' }}>
                Deploy your own private ledger with customizable compliance rules. Perfect for institutions
                requiring jurisdiction-specific financial privacy.
              </p>
              <ul className="space-y-3" style={{ color: 'var(--navy-pale)' }}>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  Self-custodial privacy with user-controlled encryption
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  Configurable compliance for any jurisdiction
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold-bright)' }} className="mr-3">•</span>
                  Guaranteed exit rights
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-2xl" style={{ background: `linear-gradient(135deg, var(--navy-deep), var(--navy-medium))` }}>
              <h3 className="text-3xl font-bold text-white mb-6">2. MIST Chamber</h3>
              <p className="text-lg mb-6" style={{ color: 'var(--navy-pale)' }}>
                Cross-chain privacy solution enabling private transfers across different blockchain networks
                with full compliance integration.
              </p>
              <ul className="space-y-3" style={{ color: 'var(--navy-pale)' }}>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  Cross-chain interoperability
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  Homomorphic encryption for amounts
                </li>
                <li className="flex items-start">
                  <span style={{ color: 'var(--gold)' }} className="mr-3">•</span>
                  Real-time compliance monitoring
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FOCBB Partnership Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-900 bg-opacity-80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
            FOCBB: Fully On-Chain Better Banks
          </h2>
          <p className="text-xl text-gray-300 text-center mb-16 max-w-4xl mx-auto">
            Partner with us to build compliant privacy ledgers for the future of finance.
            FOCBB provides the framework for secure, auditable private ledgers across blockchain networks.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Privacy <span className="text-blue-400">●</span>
              </h3>
              <p className="text-gray-300">
                Confidentiality & anonymity with homomorphic encryption
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Compliance <span className="text-yellow-400">●</span>
              </h3>
              <p className="text-gray-300">
                Configurable rules for any jurisdiction or regulatory requirement
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Self-Custody <span className="text-blue-400">●</span>
              </h3>
              <p className="text-gray-300">
                Users maintain full control of their assets and encryption keys
              </p>
            </div>
            <div className="text-center p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Interchain <span className="text-yellow-400">●</span>
              </h3>
              <p className="text-gray-300">
                Seamless asset movement across multiple blockchain networks
              </p>
            </div>
          </div>

          <div className="p-8 bg-gray-800 bg-opacity-60 rounded-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">Compliance Features for Enterprises</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Transaction Controls</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Sanctioned address screening</li>
                  <li>• Configurable delay periods</li>
                  <li>• Transaction monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Access Management</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Whitelisted KYC entities</li>
                  <li>• Compliance key verification</li>
                  <li>• Role-based permissions</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3">Threshold Enforcement</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Automated delays for high-value</li>
                  <li>• Escalating restrictions</li>
                  <li>• Real-time monitoring alerts</li>
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
            Ready to Build the Future of Private Finance?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the revolution in privacy-preserving payments. Whether you&#39;re a fintech startup,
            enterprise, or financial institution, FOCBB provides the tools you need.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Start Building
            </button>
            <button className="border border-gray-400 text-white hover:bg-gray-700 px-4 md:px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
              Partnership Inquiry
            </button>
            <Link href="https://shhtarknet.github.io/mist/" target="_blank"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 md:px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Try Old Live Demo
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
              <p className="text-gray-400 mt-2">Building compliant privacy ledgers for the future</p>
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
            <p>&copy; 2025 MIST Cash. Building the future of private, compliant finance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

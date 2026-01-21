import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Demo', href: '/chat' },
  ],
  company: [
    { name: 'About Us', href: '/#about' },
    { name: 'Contact', href: '/#contact' },

  ],

 
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61583340633161' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/106389402/admin/dashboard/' },
 
]

export default function Footer() {
  return (
    <footer className="bg-mira-navy text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <img src="/mira-ai.png" alt="MIRA AI" className="h-4 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm mb-2 max-w-sm">
              Transform your e-commerce business with AI-powered conversational shopping experiences that delight customers and drive sales.
            </p>
            <div className="space-y-3">
              <a href="mailto:contact@grayscale-technologies.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Mail size={18} />
                contact@grayscale-technologies.com
              </a>
              <a href="tel:+8801234567890" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm">
                <Phone size={18} />
                +880 1768-244283
              </a>
              <p className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin size={18} />
                Dhaka, Bangladesh
              </p>
            </div>
          </div>

          {/* Product Links */}
          <div >
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div >
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          

        
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; 2025 MIRA AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"
                aria-label={social.name}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

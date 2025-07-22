import React from "react";
import { Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

// Helper component for individual footer links for cleaner code
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <a
      href={href}
      className="text-background/70 transition-colors hover:text-background"
    >
      {children}
    </a>
  </li>
);

function Footer() {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/activityace",
      icon: Instagram,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/people/ActivityAce/61577913501016/",
      icon: Facebook,
    },
    {
      name: "TikTok",
      href: "https://www.tiktok.com/@activityace",
      icon: MessageCircle,
    }, // Using a generic icon for TikTok
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and description section */}
          <div className="col-span-2 md:col-span-2 pr-8">
            <a href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-green-700">
                <span className="font-bold text-lg text-primary-foreground">
                  F
                </span>
              </div>
              <span className="font-bold text-lg">FindMyCamps</span>
            </a>
            <p className="mt-4 text-sm text-background/70">
              The definitive guide to discovering the best camps and activities
              for kids. Explore, compare, and get ready for adventure.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase">
              For Parents
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <FooterLink href="#">Search Camps</FooterLink>
              <FooterLink href="#">How It Works</FooterLink>
              <FooterLink href="#">Parent Reviews</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase">
              For Camp Owners
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <FooterLink href="#">List a Camp</FooterLink>
              <FooterLink href="#">Owner Dashboard</FooterLink>
              <FooterLink href="#">Pricing</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wider uppercase">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Careers</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom bar with copyright and social links */}
        <div className="mt-16 pt-8 border-t border-background/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-background/50 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FindMyCamps. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 transition-colors hover:text-background"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

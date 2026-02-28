import MapPinLineIcon from "remixicon-react/MapPinLineIcon";
import PhoneLineIcon from "remixicon-react/PhoneLineIcon";
import MailLineIcon from "remixicon-react/MailLineIcon";
import InstagramLineIcon from "remixicon-react/InstagramLineIcon";

function Footer() {
  return (
    <footer id="contact" className="relative py-16 bg-black/70 backdrop-blur-md border-t border-white/10">
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {/* Brand / About */}
        <div className="space-y-4">
          <img src="/logo.png" alt="AuraDrive Logo" className="h-20 w-auto" />
          <p className="text-white/60 text-sm font-serif">
            AuraDrive offers premium car rentals with a focus on luxury,
            comfort, and unforgettable experiences.
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg font-serif">
            Contact Us
          </h4>

          <p className="text-white/70 text-sm flex items-center gap-2">
            <MapPinLineIcon className="w-5 h-5 text-white/70" />
            Dakhla, Morocco
          </p>

          <p className="text-white/70 text-sm flex items-center gap-2">
            <PhoneLineIcon className="w-5 h-5 text-white/70" />
            +212 600 000 000
          </p>

          <p className="text-white/70 text-sm flex items-center gap-2">
            <MailLineIcon className="w-5 h-5 text-white/70" />
            contact@AuraDrive.com
          </p>
        </div>

        {/* Social / Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg font-serif">
            Follow Us
          </h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="
                relative
                p-3
                rounded-full
                bg-white/10
                backdrop-blur-sm
                border border-white/20
                shadow-[0_4px_15px_rgba(200,167,142,0.15)]
                hover:bg-white/20
                hover:shadow-[0_8px_25px_rgba(200,167,142,0.3)]
                transition-all duration-300
                flex items-center justify-center
              "
            >
              <InstagramLineIcon className="w-5 h-5 text-white/80" />
              {/* Soft gradient overlay */}
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-30 pointer-events-none"></span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <p className="mt-12 text-center text-white/40 text-sm">
        © {new Date().getFullYear()} AuraDrive. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
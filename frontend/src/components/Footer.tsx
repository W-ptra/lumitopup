import discordLogo from "../assets/discord.png";
import whatsappLogo from "../assets/whatsapp.png";
import instagramLogo from "../assets/instagram.png";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div
        className="
          h-12 md:h-16
          px-3 md:px-8
          flex items-center justify-between
          text-[11px] md:text-sm
          text-[#7491F7]
        "
      >
        {/* Left */}
        <div className="flex items-center gap-2 md:gap-4 font-medium">
          <span>© {new Date().getFullYear()} LumiTopUp</span>
          <a
            href="/privacy-policy"
            className="hidden md:inline hover:underline"
          >
            Privacy Policy
          </a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* WhatsApp */}
          <a className="flex items-center gap-2">
            <img src={whatsappLogo} className="size-3.5 md:size-4" />
            <span className="hidden md:inline">+62 812-3456-789</span>
          </a>

          {/* Instagram */}
          <a className="flex items-center gap-2">
            <img src={instagramLogo} className="size-4 md:size-5" />
            <span className="hidden md:inline">@lumitopup</span>
          </a>

          {/* Discord */}
          <a className="flex items-center gap-2">
            <img src={discordLogo} className="size-4 md:size-5" />
            <span className="hidden md:inline">LumiTopUp</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

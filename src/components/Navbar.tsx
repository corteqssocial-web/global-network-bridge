import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, LogIn, LogOut, MapPin, PenLine, ChevronDown, Users, Briefcase, Building2, Shield, Flag, Newspaper, MoreHorizontal, MessageCircle, Calendar } from "lucide-react";
import corteqsLogo from "@/assets/corteqs-logo.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDiaspora, diasporaOptions, countryList } from "@/contexts/DiasporaContext";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { diaspora, setDiaspora, t, currentOption, selectedCountry, setSelectedCountry } = useDiaspora();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  // Routes that have their own dedicated Country+City selector (CountryCitySelector)
  // — hide the duplicate navbar selector on these pages.
  const routesWithOwnSelector = [
    "/consultants",
    "/businesses",
    "/associations",
    "/events",
    "/city-news",
    "/whatsapp-groups",
    "/map",
  ];
  const hasOwnSelector = routesWithOwnSelector.some((p) => location.pathname.startsWith(p));
  // Country selector only makes sense for the Turkish diaspora (the only one
  // with full country/city data live). For other diasporas — and the register-
  // diaspora landing — hide it entirely so it isn't confused with the diaspora picker.
  const isInternational = diaspora !== "tr";
  const isRegisterDiaspora = location.pathname.startsWith("/register-diaspora");
  const showNavbarCountry = !isHome && !hasOwnSelector && !isInternational && !isRegisterDiaspora;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2" style={{ minHeight: '4rem' }}>
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={corteqsLogo} alt="CorteQS" className="w-auto" style={{ height: '4rem' }} />
            </Link>

            {/* Diaspora Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-base px-2">
                  <span className="text-lg">{currentOption.flag}</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground">{currentOption.label}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">{t.nav.selectDiaspora}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {diasporaOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.key}
                    className={`gap-2 cursor-pointer ${diaspora === opt.key ? "bg-accent/50 font-semibold" : ""}`}
                    onClick={() => { setDiaspora(opt.key); navigate("/"); }}
                  >
                    <span className="text-lg">{opt.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.nativeLabel}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer"
                  onClick={() => navigate("/register-diaspora")}
                >
                  <span className="text-lg">🌐</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Register Diaspora</span>
                    <span className="text-xs text-muted-foreground">Request your community</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Country Selector — hidden on home page */}
            {showNavbarCountry && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 px-2.5 h-8 text-xs border-border">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span className="hidden sm:inline">{selectedCountry === "all" ? t.nav.allCountries : selectedCountry}</span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 max-h-[70vh] overflow-y-auto">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{t.nav.selectCountry}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className={`cursor-pointer text-sm ${selectedCountry === "all" ? "bg-accent/50 font-semibold" : ""}`}
                    onClick={() => setSelectedCountry("all")}
                  >
                    🌍 {t.nav.allCountries}
                  </DropdownMenuItem>
                  {countryList.map((c) => (
                    <DropdownMenuItem
                      key={c}
                      className={`cursor-pointer text-sm ${selectedCountry === c ? "bg-accent/50 font-semibold" : ""}`}
                      onClick={() => setSelectedCountry(c)}
                    >
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/consultants" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">{t.nav.consultants}</Link>
            <Link to="/businesses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.businesses}</Link>
            <Link to="/associations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.organizations}</Link>
            <Link to="/bloggers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t.nav.vblogger}</Link>

            {/* More Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium text-muted-foreground hover:text-foreground px-2 h-auto">
                  {t.nav.more}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/events" className="flex items-center gap-2 cursor-pointer">
                    <Calendar className="h-3.5 w-3.5 text-primary" />{t.nav.events}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/whatsapp-groups" className="flex items-center gap-2 cursor-pointer">
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />{t.nav.groups}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/city-news" className="flex items-center gap-2 cursor-pointer">
                    <Newspaper className="h-3.5 w-3.5 text-primary" />{t.nav.media}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/map" className="flex items-center gap-2 cursor-pointer">
                    <MapPin className="h-3.5 w-3.5 text-primary" />{t.nav.map}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    {t.nav.dashboard}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" /> {t.nav.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <LogIn className="h-4 w-4" /> {t.nav.login}
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="default" size="sm">{t.nav.signup}</Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-3">
              {/* Mobile Diaspora Selector */}
              <div className="flex gap-2 mb-2">
                {diasporaOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setDiaspora(opt.key); navigate("/"); setIsOpen(false); }}
                    className={`text-xl p-1.5 rounded-lg transition-all ${diaspora === opt.key ? "bg-primary/15 ring-2 ring-primary/30 scale-110" : "hover:bg-muted"}`}
                  >
                    {opt.flag}
                  </button>
                ))}
              </div>
              {/* Mobile Country Selector — hidden on home */}
              {showNavbarCountry && (
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground mb-2"
                >
                  <option value="all">🌍 {t.nav.allCountries}</option>
                  {countryList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              )}
              <Link to="/consultants" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.consultants}</Link>
              <Link to="/associations" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.organizations}</Link>
              <Link to="/businesses" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.businesses}</Link>
              <Link to="/bloggers" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsOpen(false)}><PenLine className="h-3 w-3" />{t.nav.vblogger}</Link>
              <Link to="/whatsapp-groups" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.groups}</Link>
              <Link to="/events" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>{t.nav.events}</Link>
              <Link to="/city-news" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsOpen(false)}><Newspaper className="h-3 w-3" />{t.nav.media}</Link>
              
              <Link to="/map" className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1" onClick={() => setIsOpen(false)}><MapPin className="h-3 w-3" />{t.nav.map}</Link>
              <div className="border-t border-border pt-3 mt-1">
                {user ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-foreground py-1.5" onClick={() => setIsOpen(false)}>
                      <User className="h-4 w-4 text-primary" />
                      {profile?.full_name || t.nav.profile}
                    </Link>
                    <button
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1.5 w-full"
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                    >
                      <LogOut className="h-4 w-4" /> {t.nav.logout}
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">{t.nav.login}</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setIsOpen(false)} className="flex-1">
                      <Button variant="default" size="sm" className="w-full">{t.nav.signup}</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

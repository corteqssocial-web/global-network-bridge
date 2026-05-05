import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileIndividual from "@/components/profiles/ProfileIndividual";
import ProfileBusiness from "@/components/profiles/ProfileBusiness";
import ProfileAssociation from "@/components/profiles/ProfileAssociation";
import ProfileConsultant from "@/components/profiles/ProfileConsultant";
import ProfileAdmin from "@/components/profiles/ProfileAdmin";
import ProfileBlogger from "@/components/profiles/ProfileBlogger";
import ProfileAmbassador from "@/components/profiles/ProfileAmbassador";

const Profile = () => {
  const { user, loading, accountType, onboardingCompleted } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const previewView = searchParams.get("view");
  const previewViews = ["individual", "business", "association", "consultant", "admin", "blogger", "ambassador"];
  const isPreviewMode = !!previewView && previewViews.includes(previewView);

  useEffect(() => {
    if (isPreviewMode) return;

    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && user && !onboardingCompleted) {
      navigate("/onboarding");
    }
  }, [loading, user, onboardingCompleted, navigate, isPreviewMode]);

  const renderProfile = () => {
    const activeView = isPreviewMode ? previewView : accountType;

    switch (activeView) {
      case "business":
        return <ProfileBusiness />;
      case "association":
        return <ProfileAssociation />;
      case "consultant":
        return <ProfileConsultant />;
      case "admin":
        return <ProfileAdmin />;
      case "blogger":
        return <ProfileBlogger />;
      case "ambassador":
        return <ProfileAmbassador />;
      default:
        return <ProfileIndividual />;
    }
  };

  if (loading && !isPreviewMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Ana Sayfa
          </Link>
          {isPreviewMode && (
            <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
              Dashboard önizleme modu: <span className="font-semibold">{previewView}</span>
            </div>
          )}
          {renderProfile()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;

import { Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { ClubsProvider } from "@/contexts/ClubsContext";
import { NotificationsProvider } from "@/contexts/NotificationsContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { PreviewBanner } from "@/components/PreviewBanner";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "@/pages/LandingPage";
import AuthPage from "@/pages/auth/AuthPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import Onboarding from "@/pages/Onboarding";
import LearnerDashboard from "@/pages/dashboard/LearnerDashboard";
import TeacherDashboard from "@/pages/dashboard/TeacherDashboard";
import SchoolDashboard from "@/pages/dashboard/SchoolDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";
import LearnIndex from "@/pages/learn/LearnIndex";
import CourseDetail from "@/pages/learn/CourseDetail";
import LessonView from "@/pages/learn/LessonView";
import Quiz from "@/pages/quiz/Quiz";
import ClubsIndex from "@/pages/clubs/ClubsIndex";
import ClubDetail from "@/pages/clubs/ClubDetail";
import Challenges from "@/pages/Challenges";
import Leaderboard from "@/pages/Leaderboard";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Notifications from "@/pages/Notifications";
import Mande from "@/pages/Mande";
import Ambassador from "@/pages/Ambassador";
import AdminAmbassadors from "@/pages/AdminAmbassadors";
import Support from "@/pages/support/Support";
import SupportChat from "@/pages/support/SupportChat";
import SupportServices from "@/pages/support/SupportServices";
import SupportResources from "@/pages/support/SupportResources";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppShell() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuth =
    pathname === "/auth" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";
  const previewPaths = ["/learn", "/clubs", "/challenges", "/leaderboard"];
  const isPreviewPath = previewPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAppPage =
    pathname.startsWith("/learn") ||
    pathname.startsWith("/clubs") ||
    pathname === "/challenges" ||
    pathname === "/leaderboard" ||
    pathname.startsWith("/support") ||
    pathname === "/progress" ||
    pathname === "/profile" ||
    pathname === "/notifications" ||
    pathname.startsWith("/quiz") ||
    pathname === "/mande" ||
    isDashboard;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isDashboard && !isAuth && <Navbar />}
      {isPreviewPath && !isAuthenticated && <PreviewBanner />}
      <div className="route-transition flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/learn" element={<LearnIndex />} />
          <Route path="/learn/:courseId" element={<CourseDetail />} />
          <Route path="/learn/:courseId/:lessonId" element={<LessonView />} />
          <Route path="/quiz/:quizId" element={<Quiz />} />
          <Route path="/clubs" element={<ClubsIndex />} />
          <Route path="/clubs/:clubId" element={<ClubDetail />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route
            path="/ambassador"
            element={
              <ProtectedRoute>
                <Ambassador />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ambassadors"
            element={
              <ProtectedRoute>
                <AdminAmbassadors />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/support" element={<Support />} />
          <Route
            path="/support/chat"
            element={
              <ProtectedRoute>
                <SupportChat />
              </ProtectedRoute>
            }
          />
          <Route path="/support/services" element={<SupportServices />} />
          <Route path="/support/resources" element={<SupportResources />} />
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mande"
            element={
              <ProtectedRoute roles={["admin", "programme_admin"]}>
                <Mande />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/learner"
            element={
              <ProtectedRoute>
                <LearnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/teacher"
            element={
              <ProtectedRoute roles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/school"
            element={
              <ProtectedRoute roles={["school_admin"]}>
                <SchoolDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute roles={["admin", "programme_admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isDashboard && !isAuth && <Footer />}
      {isAppPage && <MobileBottomNav />}
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <ProgressProvider>
            <ClubsProvider>
              <NotificationsProvider>
                <AppShell />
              </NotificationsProvider>
            </ClubsProvider>
          </ProgressProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff, GraduationCap, Briefcase } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"student" | "professional">("student");
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg, hsl(263 70% 28%) 0%, hsl(263 70% 40%) 50%, hsl(330 81% 50%) 100%)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-display text-2xl font-bold text-primary-foreground">RoomMatch</span>
        </div>

        <div>
          <h1 className="font-display text-4xl font-bold text-primary-foreground leading-tight mb-4">
            Join the Safest<br />
            Room-Finding<br />
            Community
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-md">
            Verified users. Smart matching. No brokers. Built for students and young professionals.
          </p>

          <div className="mt-8 space-y-3">
            {[
              "✔ Verified identity for trust & safety",
              "✔ Smart matching based on college & hometown",
              "✔ In-app chat — no sharing numbers",
              "✔ Emergency rooms for exam stays",
            ].map((item) => (
              <p key={item} className="text-sm text-primary-foreground/80">{item}</p>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {["1,200+ Users", "800+ Rooms", "15+ Cities"].map((item) => (
            <div key={item} className="text-sm text-primary-foreground/60 font-medium">{item}</div>
          ))}
        </div>
      </div>

      {/* Right — Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-brand">RoomMatch</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground mt-2">
              {step === 1 ? "Step 1 — Basic Information" : step === 2 ? "Step 2 — Profile Details" : "Step 3 — Verification"}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-gradient-action" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                <input type="text" placeholder="Enter your full name" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Age</label>
                  <input type="number" placeholder="e.g. 21" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Gender</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                <input type="tel" placeholder="+91 9876543210" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button variant="action" size="lg" className="w-full text-base" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          )}

          {/* Step 2 — Profile Details */}
          {step === 2 && (
            <div className="space-y-4">
              {/* User Type Toggle */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUserType("student")}
                    className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      userType === "student"
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <GraduationCap className={`w-5 h-5 ${userType === "student" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-semibold ${userType === "student" ? "text-primary" : "text-muted-foreground"}`}>Student</span>
                  </button>
                  <button
                    onClick={() => setUserType("professional")}
                    className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      userType === "professional"
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 ${userType === "professional" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-semibold ${userType === "professional" ? "text-primary" : "text-muted-foreground"}`}>Professional</span>
                  </button>
                </div>
              </div>

              {userType === "student" ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">College Name</label>
                    <input type="text" placeholder="e.g. IIT Bombay" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Course</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>Engineering</option>
                        <option>Pharmacy</option>
                        <option>MBA</option>
                        <option>Medical</option>
                        <option>Arts</option>
                        <option>Science</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-1.5">Year</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                        <option>PG 1st Year</option>
                        <option>PG 2nd Year</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Company Name</label>
                    <input type="text" placeholder="e.g. Infosys" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Job Role</label>
                    <input type="text" placeholder="e.g. Software Engineer" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Current City</label>
                  <input type="text" placeholder="e.g. Mumbai" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Home District</label>
                  <input type="text" placeholder="e.g. Jaipur" className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button variant="action" size="lg" className="flex-1" onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3 — Verification */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="bg-accent rounded-xl p-4">
                <p className="text-sm text-accent-foreground font-medium mb-1">🛡 Identity Verification Required</p>
                <p className="text-xs text-muted-foreground">Upload your ID and take a live selfie to get verified. Verified users get more visibility and trust badges.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Aadhaar Card or PAN Card</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                  <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG • Max 5MB</p>
                </div>
              </div>

              {userType === "student" ? (
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Student ID or Admission Proof</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                    <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG • Max 5MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Company ID</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                    <p className="text-sm text-muted-foreground">Click or drag to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, JPG, or PNG • Max 5MB</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Live Selfie Verification</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer bg-muted/50">
                  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl">📸</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Click to capture live photo</p>
                  <p className="text-xs text-muted-foreground mt-1">Used for identity verification only</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button variant="action" size="lg" className="flex-1" asChild>
                  <Link to="/dashboard">Create Account</Link>
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground">
                You can skip verification now and complete it later from your profile.
              </p>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground">or</span>
                </div>
              </div>

              <Button variant="outline" size="lg" className="w-full text-sm font-medium">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;

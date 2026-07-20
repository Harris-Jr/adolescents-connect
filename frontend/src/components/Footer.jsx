import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
const socials = [
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { icon: Twitter, label: "Twitter", href: "https://x.com" },
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
];
export function Footer() {
    return (<footer className="bg-[#1a1a2e] text-white">
      <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-8">
        {/* TOP: Logo + socials centered */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3">
            <img src="/images/alinks-logo.jpeg" alt="A-LINKS logo" width={160} height={64} className="h-10 w-auto rounded-lg bg-white p-1"/>
            <span className="text-xl font-extrabold tracking-tight text-white">
              {"\n"}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-4">
            {socials.map(({ icon: Icon, label, href }) => (<a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-white transition-colors duration-200 hover:text-[#6B3FA0]">
                <Icon className="h-[18px] w-[18px]"/>
              </a>))}
          </div>
        </div>

        {/* MIDDLE: 3 columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Column 1 — BRAND */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-white">
              A-LINKS
            </h3>
            <p className="text-[13px] italic text-white/70">
              Your future. Your choices. Your voice.
            </p>
            <p className="mt-2 text-[11px] text-white/60 lg:hidden">
              Locate • Inform • Nurture • Knowledge in Action • Sustain
            </p>
          </div>

          {/* Column 2 — CONTACT */}
          <div className="text-center md:text-left">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-white">
              CONTACT
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                Email:{" "}
                <a href="mailto:info@alinks.org" className="transition-colors hover:text-white">
                  info@alinks.org
                </a>
              </li>
              <li>Phone: +260 XXX XXX XXX</li>
            </ul>
            <Link to="/support" className="mt-4 inline-flex items-center gap-2 rounded-[50px] border border-[#00BFA5] px-5 py-2 text-sm font-medium text-[#00BFA5] transition-colors duration-200 hover:bg-[#00BFA5] hover:text-white">
              <MessageCircle className="h-4 w-4"/>
              Talk to Someone
            </Link>
          </div>

          {/* Column 3 — LEGAL */}
          <div className="text-center md:text-right">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[2px] text-white">
              LEGAL
            </h3>
            <nav className="flex flex-col items-center gap-2 md:items-end">
              {/* Privacy Policy */}
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-sm text-white transition-all duration-200 hover:text-[#00BFA5] hover:underline">
                    Privacy Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-3xl p-0 text-foreground">
                  <div className="border-b px-6 py-4">
                    <DialogTitle className="text-lg font-semibold text-[#1a1a2e]">
                      Privacy Policy
                    </DialogTitle>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Effective Date: 17 June 2026 &nbsp;|&nbsp; Last Updated: 17 June 2026
                    </p>
                    <div className="space-y-4">
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">1. INTRODUCTION</h4>
                        <p>A-LINKS ("we", "our", "us") is committed to protecting the privacy and safety of all users, particularly adolescents. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use the A-LINKS platform.</p>
                        <p className="mt-1">By using A-LINKS, you agree to the terms of this Privacy Policy.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">2. WHO WE ARE</h4>
                        <p>A-LINKS is an integrated adolescent support ecosystem developed and managed by the Zambian Cyber Security Initiative Foundation (ZCSIF).</p>
                        <p className="mt-1">Contact: info@alinks.org<br />Phone: +260 XXX XXX XXX</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">3. INFORMATION WE COLLECT</h4>
                        <p>We collect the following information when you register:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>First name and last name</li>
                          <li>Gender</li>
                          <li>Grade level</li>
                          <li>School name</li>
                          <li>Phone number</li>
                          <li>Email address (optional)</li>
                          <li>Role (Student or Teacher)</li>
                        </ul>
                        <p className="mt-2">We also collect:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Learning progress and quiz scores</li>
                          <li>Club memberships and activities</li>
                          <li>Challenge participation</li>
                          <li>Device and browser information</li>
                          <li>Usage data and activity logs</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">4. HOW WE USE YOUR INFORMATION</h4>
                        <p>We use your information to:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Create and manage your account</li>
                          <li>Track your learning progress</li>
                          <li>Personalise your experience</li>
                          <li>Award badges, points and certificates</li>
                          <li>Connect you to support services</li>
                          <li>Generate programme reports and statistics</li>
                          <li>Improve the platform</li>
                          <li>Send notifications about your activity</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">5. CHILD SAFETY AND PROTECTION</h4>
                        <p>A-LINKS serves adolescents aged 10-18. We take child protection seriously:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>We do not sell or share personal data of minors with third parties for commercial purposes</li>
                          <li>Support service referrals are handled with strict confidentiality</li>
                          <li>Programme administrators and teachers can only access data relevant to their role and school</li>
                          <li>All staff with access to user data are trained in safeguarding</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">6. DATA SHARING</h4>
                        <p>We may share your information with:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Your school administrators and teachers (limited to your progress and activity)</li>
                          <li>Programme administrators for monitoring and evaluation</li>
                          <li>Development partners for anonymised reporting only</li>
                          <li>Government authorities if required by law to protect child safety</li>
                        </ul>
                        <p className="mt-2">We do NOT share your data with:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Advertisers</li>
                          <li>Commercial third parties</li>
                          <li>Social media platforms</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">7. DATA STORAGE AND SECURITY</h4>
                        <p>Your data is stored securely using:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Encrypted databases</li>
                          <li>Secure HTTPS connections</li>
                          <li>Role-based access controls</li>
                          <li>Regular security audits</li>
                        </ul>
                        <p className="mt-2">We retain your data for as long as your account is active or as required by law.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">8. YOUR RIGHTS</h4>
                        <p>You have the right to:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Access your personal data</li>
                          <li>Correct inaccurate information</li>
                          <li>Request deletion of your account</li>
                          <li>Withdraw consent at any time</li>
                          <li>Lodge a complaint with relevant authorities</li>
                        </ul>
                        <p className="mt-2">To exercise these rights contact us at: info@alinks.org</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">9. COOKIES</h4>
                        <p>A-LINKS uses essential cookies to:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Keep you logged in</li>
                          <li>Remember your language preference</li>
                          <li>Track your learning session</li>
                        </ul>
                        <p className="mt-2">We do not use advertising or tracking cookies.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">10. CHANGES TO THIS POLICY</h4>
                        <p>We may update this policy from time to time. We will notify you of significant changes through the platform or by email.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">11. CONTACT US</h4>
                        <p>For privacy concerns contact:</p>
                        <p className="mt-1">Email: info@alinks.org<br />Phone: +260 XXX XXX XXX<br />Address: Zambia</p>
                      </section>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Terms of Use */}
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-sm text-white transition-all duration-200 hover:text-[#00BFA5] hover:underline">
                    Terms of Use
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg rounded-3xl p-0 text-foreground">
                  <div className="border-b px-6 py-4">
                    <DialogTitle className="text-lg font-semibold text-[#1a1a2e]">
                      Terms of Use
                    </DialogTitle>
                  </div>
                  <div className="max-h-[70vh] overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-700">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Effective Date: 17 June 2026 &nbsp;|&nbsp; Last Updated: 17 June 2026
                    </p>
                    <div className="space-y-4">
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">1. ACCEPTANCE OF TERMS</h4>
                        <p>By accessing or using A-LINKS you agree to be bound by these Terms of Use. If you do not agree, do not use the platform.</p>
                        <p className="mt-1">These terms apply to all users including students, teachers, school administrators, and programme staff.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">2. ABOUT A-LINKS</h4>
                        <p>A-LINKS is an integrated adolescent support ecosystem providing digital learning, life skills, health information, leadership opportunities and support services to adolescents in Zambia.</p>
                        <p className="mt-1">Developed by: Zambian Cyber Security Initiative Foundation (ZCSIF)<br />Contact: info@alinks.org</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">3. ELIGIBILITY</h4>
                        <p>A-LINKS is designed for:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Adolescents in Grades 5 to 12</li>
                          <li>Teachers working with these grade levels</li>
                          <li>School administrators</li>
                          <li>Programme managers and M&E officers</li>
                        </ul>
                        <p className="mt-2">Users under 13 must have consent from a parent or guardian to register.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">4. USER ACCOUNTS</h4>
                        <p>You are responsible for:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Providing accurate registration information</li>
                          <li>Keeping your password confidential</li>
                          <li>All activity that occurs under your account</li>
                          <li>Notifying us immediately of any unauthorised access</li>
                        </ul>
                        <p className="mt-2">Do not share your account with others. Each person must have their own account.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">5. ACCEPTABLE USE</h4>
                        <p>You agree to use A-LINKS only for lawful and appropriate purposes.</p>
                        <p className="mt-1">You must NOT:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Use the platform to bully, harass, or intimidate other users</li>
                          <li>Share inappropriate, offensive, or harmful content</li>
                          <li>Attempt to access other users accounts</li>
                          <li>Use the platform for commercial purposes</li>
                          <li>Copy or distribute platform content without permission</li>
                          <li>Attempt to hack or disrupt the platform</li>
                          <li>Impersonate another person or create fake accounts</li>
                          <li>Share personal information of other users without consent</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">6. CONTENT</h4>
                        <p>All learning content on A-LINKS is:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Created or approved by qualified educators</li>
                          <li>Age-appropriate for Grades 5 to 12</li>
                          <li>Aligned with the Zambian curriculum and LSHE framework</li>
                        </ul>
                        <p className="mt-2">Teacher-uploaded content is reviewed by programme administrators before being made available to learners.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">7. GAMIFICATION AND REWARDS</h4>
                        <p>Points, badges, and certificates earned on A-LINKS:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Are for educational recognition only</li>
                          <li>Have no monetary value</li>
                          <li>Cannot be transferred or sold</li>
                          <li>May be reset or adjusted by administrators</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">8. SUPPORT SERVICES</h4>
                        <p>Support service referrals made through A-LINKS are:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Confidential</li>
                          <li>Handled by trained programme staff</li>
                          <li>Not a substitute for emergency services</li>
                        </ul>
                        <p className="mt-2">In an emergency always call 991 or Child Helpline 116.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">9. INTELLECTUAL PROPERTY</h4>
                        <p>All content on A-LINKS including text, images, videos, logos, and course materials is owned by or licensed to ZCSIF.</p>
                        <p className="mt-1">You may not reproduce, distribute, or sell any platform content without written permission.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">10. DISCLAIMER</h4>
                        <p>A-LINKS is provided "as is". We do not guarantee:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>Uninterrupted access at all times</li>
                          <li>That all content is error-free</li>
                          <li>That the platform meets every individual need</li>
                        </ul>
                        <p className="mt-2">We are not liable for any loss or harm resulting from use of the platform.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">11. TERMINATION</h4>
                        <p>We may suspend or terminate your account if:</p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-5">
                          <li>You violate these terms</li>
                          <li>Your account is used inappropriately</li>
                          <li>A safeguarding concern arises</li>
                        </ul>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">12. CHANGES TO TERMS</h4>
                        <p>We may update these terms at any time. Continued use of A-LINKS after changes means you accept the new terms.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">13. GOVERNING LAW</h4>
                        <p>These terms are governed by the laws of the Republic of Zambia.</p>
                      </section>
                      <section>
                        <h4 className="mb-1 font-semibold text-[#1a1a2e]">14. CONTACT US</h4>
                        <p>For questions about these terms:</p>
                        <p className="mt-1">Email: info@alinks.org<br />Phone: +260 XXX XXX XXX</p>
                      </section>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Safeguarding Policy */}
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-sm text-white transition-all duration-200 hover:text-[#00BFA5] hover:underline">
                    Safeguarding Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-3xl text-left text-foreground">
                  <DialogHeader>
                    <DialogTitle className="text-[#1a1a2e]">
                      Safeguarding Policy
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                      This document is being finalized. Please check back soon.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" className="rounded-xl bg-[#1a1a2e] text-white hover:bg-[#1a1a2e]/90">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-[30px] h-px bg-white/10"/>

        {/* BOTTOM BAR */}
        <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-white/60 md:flex-row md:text-left">
          <p>&copy; 2026 A-LINKS. All rights reserved.</p>
          <p>
            Developed by{" "}
            <a href="https://zcsif-organisation.org" target="_blank" rel="noopener noreferrer" className="font-semibold text-white/80 transition-colors hover:text-white">
              Zambian Cyber Security Initiative Foundation
            </a>
          </p>
        </div>
      </div>
    </footer>);
}

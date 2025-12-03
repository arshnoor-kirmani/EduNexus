"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AppData } from "@/config/appConfig";
import {
  BarChart3,
  School,
  ShieldCheck,
  UniversityIcon,
  Upload,
  User,
  UserPlus,
  Users,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
const details = AppData;
export default function Section() {
  return (
    <section className="mx-4 my-5 space-y-5">
      {/* === HERO SECTION === */}
      <Card className="overflow-visible border border-border/50 shadow-lg rounded-2xl bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_30%] gap-8 md:gap-12 p-6 md:p-10 items-start">
          {/* LEFT: HERO CONTENT */}
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Manage your institute —{" "}
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-500 bg-clip-text text-transparent">
                smarter, faster, securely.
              </span>
            </h1>

            <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
              Set up your institute in minutes. <b>{details.app.name}</b>{" "}
              empowers administrators, teachers, and students through an
              integrated platform — simplifying admissions, attendance,
              communication, and reporting with secure and intelligent tools
              built for modern education.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <Link href={AppData.routes.frontend.auth.register.institute}>
                <Button
                  size="lg"
                  className="shadow-md w-full hover:shadow-xl transition-all"
                >
                  Create Institute Account
                </Button>
              </Link>
              <Link href={AppData.routes.frontend.auth.login.institute}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="shadow-md w-full hover:shadow-xl transition-all"
                >
                  Institute Login
                </Button>
              </Link>
            </div>

            {/* KEY HIGHLIGHTS */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Highlight
                icon={<ShieldCheck className="w-5 h-5 text-chart-2" />}
                title="Secure by Design"
                subtitle="Encryption, backups & 2FA"
                color="text-chart-2"
              />
              <Highlight
                icon={<UserCheck className="w-5 h-5 text-chart-1" />}
                title="Role-Based Access"
                subtitle="Admin / Teacher / Student"
                color="text-chart-1"
              />
              <Highlight
                icon={<UserPlus className="w-5 h-5 text-chart-4" />}
                title="Fast Onboarding"
                subtitle="Streamlined setup for staff"
                color="text-chart-4"
              />
            </div>
          </div>

          {/* RIGHT: QUICK START */}
          <Card className="rounded-2xl border border-border/30 bg-gradient-to-br from-background/70 to-muted/40 p-6 shadow-md hover:shadow-xl backdrop-blur-md transition-all duration-300">
            <div className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">
              Quick Start Guide
            </div>

            <ol className="mt-5 space-y-5 text-sm">
              <QuickStep
                icon={<School className="w-5 h-5" />}
                color="bg-chart-1"
                title="Create Institute"
                desc="Add your institute’s details, logo, and preferences."
              />
              <QuickStep
                icon={<UserPlus className="w-5 h-5" />}
                color="bg-chart-2"
                title="Add Admins & Teachers"
                desc="Invite staff via email and assign secure roles."
              />
              <QuickStep
                icon={<Upload className="w-5 h-5" />}
                color="bg-chart-5"
                title="Import Students"
                desc="Upload data via CSV or register manually."
              />
            </ol>

            <div className="mt-6">
              <Link href={AppData.routes.frontend.auth.register.institute}>
                <Button className="w-full shadow-sm hover:shadow-md transition-all cursor-pointer">
                  Start Setup
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </Card>

      {/* === FEATURE SECTION === */}
      <Card className="border border-border/40 bg-card/80 backdrop-blur-sm shadow-md p-3  md:p-5  rounded-2xl">
        <CardHeader className="p-0 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Powerful Tools for Every Role
          </h2>
          <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl">
            Simplify every part of your institute’s operations — from classroom
            management to performance tracking — all in one secure dashboard.
          </p>
        </CardHeader>

        <CardContent className="pt-4 pb-2 px-2 md:px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Student Management"
            desc="Efficiently manage student data, academic records, attendance, and enrollment — all from a single, centralized dashboard."
            accent="primary"
          />

          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Secure Access"
            desc="Protect sensitive student and institute information with secure logins, two-factor authentication, and role-based permissions."
            accent="chart-2"
          />

          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Reports & Analytics"
            desc="Gain actionable insights into student performance, attendance trends, and academic progress through detailed analytics."
            accent="chart-4"
          />
        </CardContent>
      </Card>

      {/* === LOGIN ROLES === */}
      <Card className="border border-border/40 bg-card/80 backdrop-blur-sm shadow-md p-3 md:p-5 rounded-2xl">
        {/* <Card className="border border-border/40 shadow-md p-2 md:p-4 rounded-2xl bg-gradient-to-b from-background/90 to-muted/40 backdrop-blur-sm"> */}
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            Choose Your Login
          </h3>
          <p className="text-sm text-muted-foreground mt-2 md:mt-0">
            Access portal according to your role.
          </p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <InfoCard
            icon={<UniversityIcon className="w-6 h-6" />}
            title="Institute Login"
            desc="Access full administrative controls and settings."
            color="chart-1"
            href={AppData.routes.frontend.auth.login.institute}
          />

          <InfoCard
            icon={<Users className="w-6 h-6" />}
            title="Institute User Login"
            desc="Manage internal institute modules and limited features."
            color="chart-5"
            href={AppData.routes.frontend.auth.login.user}
          />

          <InfoCard
            icon={<User className="w-6 h-6" />}
            title="Teacher Login"
            desc="Manage classes, assignments, students, and academic reports."
            color="chart-2"
            href={AppData.routes.frontend.auth.login.teacher}
          />

          <InfoCard
            icon={<User className="w-6 h-6" />}
            title="Student Login"
            desc="View attendance, grades, schedules, and institute updates."
            color="chart-4"
            href={AppData.routes.frontend.auth.login.student}
          />
        </CardContent>
      </Card>
    </section>
  );
}

/* === LOCAL HELPER COMPONENTS === */

function Highlight({
  icon,
  title,
  subtitle,
  color = "text-primary",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm cursor-pointer pointer-events-none">
      {/* Icon Container */}
      <div
        className={`w-9 h-9 flex items-center justify-center rounded-md bg-muted/40 ${color} shrink-0 shadow-sm`}
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <div className={`font-semibold  text-sm`}>{title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function QuickStep({
  icon,
  color,
  title,
  desc,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-3 group">
      <div
        className={`min-w-[40px] h-10 rounded-md ${color} text-white flex items-center justify-center font-semibold shadow-sm group-hover:scale-105 transition-transform duration-200`}
      >
        {icon}
      </div>
      <div>
        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </li>
  );
}
function FeatureCard({
  icon,
  title,
  desc,
  accent = "primary",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: "primary" | "chart-2" | "chart-4" | "chart-5";
}) {
  // Accent color mapping for icon + background
  const accentClasses: Record<string, string> = {
    primary: "text-primary bg-primary/10 group-hover:bg-primary/20",
    "chart-2": "text-chart-2 bg-chart-2/10 group-hover:bg-chart-2/20",
    "chart-4": "text-chart-4 bg-chart-4/10 group-hover:bg-chart-4/20",
    "chart-5": "text-chart-5 bg-chart-5/10 group-hover:bg-chart-5/20",
  };

  return (
    <Card className="cursor-pointer group p-6 rounded-2xl border border-border/40 bg-gradient-to-b from-background/80 to-muted/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
      <CardContent className="space-y-3 p-0">
        {/* Icon Wrapper */}
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl ${accentClasses[accent]} transition-colors duration-300 mb-3`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color?: "primary" | "chart-1" | "chart-2" | "chart-4" | "chart-5";
  href?: string;
}

export function InfoCard({
  icon,
  title,
  desc,
  color = "primary",
  href = "#",
}: InfoCardProps) {
  const accentClasses: Record<string, string> = {
    primary: "text-primary bg-primary/10 group-hover:bg-primary/20",
    "chart-1": "text-chart-1 bg-chart-1/10 group-hover:bg-chart-1/20",
    "chart-2": "text-chart-2 bg-chart-2/10 group-hover:bg-chart-2/20",
    "chart-4": "text-chart-4 bg-chart-4/10 group-hover:bg-chart-4/20",
    "chart-5": "text-chart-5 bg-chart-5/10 group-hover:bg-chart-5/20",
  };

  return (
    <Card className="group p-6 rounded-2xl border border-border/40 bg-gradient-to-b from-background/80 to-muted/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm">
      <CardContent className="space-y-3 p-0">
        {/* Icon */}
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl ${accentClasses[color]} transition-colors duration-300 mb-3`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground tracking-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>

        {/* Action */}
        <div className="pt-2">
          <Link href={href}>
            <Button
              variant="secondary"
              size="sm"
              className="w-full justify-center shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Login
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

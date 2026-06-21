import { QuizField, QuizStepIntro } from "@/components/quiz/QuizField";
import { Input } from "@/components/ui/input";

interface StepAccountProps {
  email: string;
  phone: string;
  password: string;
  errors: Record<string, string>;
  onChange: (values: { email?: string; phone?: string; password?: string }) => void;
}

export function StepAccount({ email, phone, password, errors, onChange }: StepAccountProps) {
  return (
    <section>
      <QuizStepIntro
        title="Create your account"
        description="Save your progress and receive updates about your physician review."
      />

      <div className="space-y-6">
        <QuizField label="Email" error={errors.email}>
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => onChange({ email: event.target.value })}
            className="h-14 rounded-2xl border-[#DDD9D1] bg-white px-4 text-[15px] text-[#1A1816] placeholder:text-[#BFBBAF] focus:border-[#1A1816]"
            placeholder="you@example.com"
          />
        </QuizField>

        <QuizField label="Phone" error={errors.phone}>
          <Input
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => onChange({ phone: event.target.value })}
            className="h-14 rounded-2xl border-[#DDD9D1] bg-white px-4 text-[15px] text-[#1A1816] placeholder:text-[#BFBBAF] focus:border-[#1A1816]"
            placeholder="(555) 555-5555"
          />
        </QuizField>

        <QuizField
          label="Password"
          hint="At least 8 characters."
          error={errors.password}
        >
          <Input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => onChange({ password: event.target.value })}
            className="h-14 rounded-2xl border-[#DDD9D1] bg-white px-4 text-[15px] text-[#1A1816] placeholder:text-[#BFBBAF] focus:border-[#1A1816]"
            placeholder="Create a password"
          />
        </QuizField>
      </div>
    </section>
  );
}

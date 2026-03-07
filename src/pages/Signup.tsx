import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WarningCircle, Eye, EyeSlash, UserPlus, CheckCircle, XCircle } from '@phosphor-icons/react'
import { useSignup } from '@/hooks/useAuth'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card'
import { Alert, AlertDescription } from '@/components/shadcn/alert'

export default function Signup() {
  const navigate = useNavigate()
  const { mutate: signup, isPending, error, reset } = useSignup()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Email validation state
  const [emailError, setEmailError] = useState('')

  // Password strength state
  const calculatePasswordStrength = (pass: string) => {
    let score = 0
    if (pass.length === 0) return 0

    // Length check (up to 8 chars gives 25 points)
    if (pass.length >= 8) score += 25

    // Number check
    if (/\d/.test(pass)) score += 25

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pass)) score += 25

    // Mixed case check
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 25

    return score
  }

  const passwordStrength = calculatePasswordStrength(password)

  const getStrengthColor = (score: number) => {
    if (score === 0) return 'bg-gray-200'
    if (score < 50) return 'bg-error'
    if (score < 75) return 'bg-warning'
    return 'bg-success'
  }

  const getStrengthLabel = (score: number) => {
    if (score === 0) return ''
    if (score < 50) return 'Weak'
    if (score < 75) return 'Fair'
    return 'Strong'
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !re.test(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }
  }

  const passwordsMatch = password === confirmPassword
  const passwordMinLength = password.length >= 8
  const isFormValid =
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    !emailError &&
    password.trim() !== '' &&

    passwordsMatch &&
    passwordMinLength

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordsMatch) return

    reset()
    signup(
      { email, full_name: fullName, password },
      {
        onSuccess: () => {
          navigate('/login')
        },
      }
    )
  }

  return (
    <div className="h-screen flex items-center justify-center px-4 overflow-hidden relative">
      {/* Blurred gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-blue via-deep-blue/90 to-ocean-city blur-sm scale-110" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Delta<span className="text-ocean-city">.</span>
          </h1>

        </div>

        <Card className="bg-concerto border-glacial-salt/20 rounded-xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)] transform scale-[1.02]">
          <CardHeader className="flex flex-col items-center gap-1 pb-2">
            <CardTitle className="text-2xl font-semibold text-center text-deep-navy">
              Sign Up
            </CardTitle>

          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-3">
              {error && (
                <Alert variant="destructive" className="border-error bg-error/10">
                  <WarningCircle className="size-4 text-error" />
                  <AlertDescription className="text-error">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName" className="text-soft-ink">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                  disabled={isPending}
                  className="bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-soft-ink">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (emailError) validateEmail(e.target.value)
                  }}
                  onBlur={() => validateEmail(email)}
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className={`bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue ${emailError ? 'border-error' : ''}`}
                />
                {emailError && (
                  <span className="text-xs text-error mt-1">{emailError}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-soft-ink">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isPending}
                    className="pr-10 bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-soft-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {/* Password requirements */}
                {password.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Strength Meter */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-slate">Password Strength</span>
                      <span className={`font-medium ${passwordStrength < 50 ? 'text-error' :
                        passwordStrength < 75 ? 'text-warning' : 'text-success'
                        }`}>
                        {getStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle
                          className={`size-3.5 ${passwordMinLength ? 'text-success' : 'text-muted-slate'}`}
                          weight={passwordMinLength ? 'fill' : 'regular'}
                        />
                        <span className={passwordMinLength ? 'text-success' : 'text-muted-slate'}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle
                          className={`size-3.5 ${/\d/.test(password) ? 'text-success' : 'text-muted-slate'}`}
                          weight={/\d/.test(password) ? 'fill' : 'regular'}
                        />
                        <span className={/\d/.test(password) ? 'text-success' : 'text-muted-slate'}>
                          Contains a number
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle
                          className={`size-3.5 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-success' : 'text-muted-slate'}`}
                          weight={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'fill' : 'regular'}
                        />
                        <span className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-success' : 'text-muted-slate'}>
                          Special character
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <CheckCircle
                          className={`size-3.5 ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-success' : 'text-muted-slate'}`}
                          weight={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'fill' : 'regular'}
                        />
                        <span className={/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'text-success' : 'text-muted-slate'}>
                          Upper & lowercase
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-soft-ink">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    disabled={isPending}
                    className="pr-10 bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-slate hover:text-soft-ink transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeSlash className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2 text-xs mt-1.5">
                    {passwordsMatch ? (
                      <CheckCircle
                        className="size-3.5 text-success"
                        weight="fill"
                      />
                    ) : (
                      <XCircle
                        className="size-3.5 text-error"
                        weight="fill"
                      />
                    )}
                    <span className={passwordsMatch ? 'text-success' : 'text-error'}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-2">
              <Button
                type="submit"
                className="w-full bg-deep-blue text-white hover:bg-deep-blue/90 hover:shadow-cta transition-all"
                size="lg"
                disabled={isPending || !isFormValid}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="size-4" />
                    Create account
                  </span>
                )}
              </Button>

              <p className="text-sm text-center text-muted-slate">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-deep-blue hover:text-ocean-city hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-glacial-salt/80">
          © 2026 Delta. All rights reserved.
        </p>
      </div>
    </div>
  )
}

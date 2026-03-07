import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { WarningCircle, Eye, EyeSlash, SignIn } from '@phosphor-icons/react'
import { useLogin } from '@/hooks/useAuth'
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

export default function Login() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error, reset } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    reset()
    login(
      { email, password },
      {
        onSuccess: () => {
          navigate('/dashboard')
        },
      }
    )
  }

  const isFormValid = email.trim() !== '' && password.trim() !== ''

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
              Sign In
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-4">
              {error && (
                <Alert variant="destructive" className="border-error bg-error/10">
                  <WarningCircle className="size-4 text-error" />
                  <AlertDescription className="text-error">
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-soft-ink">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className="bg-pure-white border-glacial-salt/60 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-deep-blue"
                />
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
                    autoComplete="current-password"
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
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <SignIn className="size-4" />
                    Sign in
                  </span>
                )}
              </Button>

              <p className="text-sm text-center text-muted-slate">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-deep-blue hover:text-ocean-city hover:underline transition-colors"
                >
                  Sign up
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

import { Link } from 'react-router-dom'
import { House, ArrowLeft, MagnifyingGlass, GitBranch, Bell } from '@phosphor-icons/react'
import { Button } from '@/components/shadcn/button'
import { QuickLink } from '@/components/shared/QuickLink'

export default function NotFound() {
  return (
    <div className="dashboard-page">
      {/* Background */}
      <div className="dashboard-background">
        <div className="dashboard-decorations">
          <div className="geo-triangle t1" />
          <div className="geo-triangle t2" />
          <div className="geo-triangle t3" />
          <div className="geo-triangle t4" />
          <div className="geo-triangle t5" />
          <div className="geo-triangle t6" />
          <div className="geo-dot d1" />
          <div className="geo-dot d2" />
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-container flex items-center justify-center min-h-screen">
        <div className="dashboard-card max-w-lg text-center p-8">
          {/* 404 Display */}
          <div className="relative mb-8">
            <span className="text-[120px] font-bold text-deep-navy/10 font-mono leading-none">404</span>
            <MagnifyingGlass 
              className="size-16 text-ocean-city absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
              weight="duotone" 
            />
          </div>
          
          <h2 className="text-2xl font-semibold text-deep-navy mb-2">Page Not Found</h2>
          <p className="text-soft-ink mb-8 max-w-sm mx-auto">
            The page you're looking for doesn't exist or may have been moved. 
            Let's get you back on track.
          </p>
          
          {/* Quick Actions */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-deep-navy/30 text-deep-navy hover:bg-deep-navy/10"
            >
              <ArrowLeft className="size-4 mr-2" />
              Go Back
            </Button>
            <Button asChild className="btn-primary-delta">
              <Link to="/dashboard">
                <House className="size-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          </div>
          
          {/* Helpful Links */}
          <div className="border-t border-deep-navy/10 pt-6">
            <p className="text-xs text-deep-navy/50 mb-4">Or try one of these:</p>
            <div className="grid gap-2">
              <QuickLink 
                to="/dashboard" 
                icon={GitBranch}
                description="View your linked repositories"
              >
                Your Repositories
              </QuickLink>
              <QuickLink 
                to="/notifications" 
                icon={Bell}
                description="Check your latest updates"
              >
                Notifications
              </QuickLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

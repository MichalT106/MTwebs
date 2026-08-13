import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  children: ReactNode
  title?: string
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Flowtask error boundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mesh-gradient flex min-h-dvh items-center justify-center p-6">
          <Card className="glass-panel w-full max-w-md rounded-3xl border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="size-5 text-destructive" aria-hidden />
                {this.props.title ?? 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{this.state.error.message}</p>
              <Button
                type="button"
                className="rounded-xl"
                onClick={() => {
                  this.setState({ error: null })
                  window.location.reload()
                }}
              >
                Reload app
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}

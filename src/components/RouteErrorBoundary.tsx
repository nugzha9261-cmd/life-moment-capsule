import React from 'react';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

const RELOAD_FLAG = 'reelive:chunk-reloaded';

const isChunkLoadError = (error: Error) => {
  const text = `${error?.name ?? ''} ${error?.message ?? ''}`.toLowerCase();
  return (
    text.includes('dynamically imported module') ||
    text.includes('failed to fetch dynamically') ||
    text.includes('loading chunk') ||
    text.includes('importing a module script failed') ||
    text.includes('chunkloaderror')
  );
};

/**
 * Catches render/lazy-loading failures so a stale deploy (missing JS chunk)
 * never leaves the user on a blank white screen.
 */
class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Route error:', error);

    // A missing chunk means the app was redeployed while this tab was open.
    // One automatic hard reload fetches the fresh build.
    if (isChunkLoadError(error) && sessionStorage.getItem(RELOAD_FLAG) !== '1') {
      sessionStorage.setItem(RELOAD_FLAG, '1');
      window.location.reload();
    }
  }

  componentDidUpdate() {
    if (!this.state.error) sessionStorage.removeItem(RELOAD_FLAG);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-8 text-center">
        <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          This page couldn&apos;t load. Reloading usually fixes it.
        </p>
        <button
          onClick={() => {
            sessionStorage.removeItem(RELOAD_FLAG);
            window.location.reload();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          Reload
        </button>
      </div>
    );
  }
}

export default RouteErrorBoundary;

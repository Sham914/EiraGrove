"use client";

import { Component, type ReactNode } from "react";
import { setFallbackMode } from "@/store/app-store";
import { FallbackExperience } from "./FallbackExperience";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {
    setFallbackMode(true);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackExperience />;
    }
    return this.props.children;
  }
}

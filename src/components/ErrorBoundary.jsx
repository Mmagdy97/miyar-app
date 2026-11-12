import { Component } from "react";
import { tr_ as T } from "../i18n";

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#F3EFE6] text-[#1A2236] text-center">
        <div>
          <h1 className="text-xl font-bold">{T("nf.title")}</h1>
          <p className="mt-2 text-sm text-[#535E78]">{T("nf.desc")}</p>
          <button onClick={() => window.location.reload()} className="mt-5 px-5 py-2.5 rounded-lg bg-[#B5452B] text-white text-sm font-bold cursor-pointer">{T("nf.reload")}</button>
        </div>
      </div>
    );
  }
}

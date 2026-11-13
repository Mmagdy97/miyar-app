import { useState } from "react";
import { tr_ as T } from "../i18n";
import LiveInvoices from "./LiveInvoices";
import LiveCash from "./LiveCash";

/** Real-office finance: invoices + petty cash tabs. */
export default function LiveFinance() {
  const [tab, setTab] = useState("inv");
  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div role="tablist" className="flex gap-2 px-4 md:px-8 pt-4 font-ibm">
        {[["inv", "fin.tabInv"], ["cash", "fin.tabCash"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} type="button" onClick={() => setTab(k)} className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer border ${tab === k ? "bg-[#17614F] text-white border-[#17614F]" : "bg-white text-[#1F2421] border-[#E6DFD0]"}`}>{T(l)}</button>
        ))}
      </div>
      {tab === "inv" ? <LiveInvoices /> : (
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 font-ibm"><div className="max-w-4xl mx-auto"><LiveCash /></div></main>
      )}
    </div>
  );
}
